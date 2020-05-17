import requests
import os
import threading
import uuid 

production = 'KUBERNETES_SERVICE_HOST' in os.environ

if production:
    def get_address(host, port):
        return f'http://{host}:{port}'
    cloud_object_storage_service_host = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_HOST']
    cloud_object_storage_service_port = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_PORT']
    cloud_object_storage_service_address = get_address(
        cloud_object_storage_service_host, cloud_object_storage_service_port)

    compare_service_host = os.environ['COMPARE_SERVICE_HOST']
    compare_service_port = os.environ['COMPARE_SERVICE_PORT']
    compare_service_address = get_address(
        compare_service_host, compare_service_port)

    screenshot_host = os.environ['SCREENSHOT_SERVICE_HOST']
    screenshot_port = os.environ['SCREENSHOT_SERVICE_PORT']
    screenshot_address = get_address(
        screenshot_host, screenshot_port)

    
    configure_host = os.environ['CONFIGURE_SERVICE_HOST']
    configure_port = os.environ['CONFIGURE_SERVICE_PORT']
    configure_address = get_address(
        configure_host, configure_port)

    notify_host = os.environ['NOTIFY_SERVICE_HOST']
    notify_port = os.environ['NOTIFY_SERVICE_PORT']
    notify_address = get_address(
        notify_host, notify_port)

else:
    cloud_object_storage_service_address = 'http://0.0.0.0:8001'
    compare_service_address = 'http://0.0.0.0:8002'
    screenshot_address = 'http://0.0.0.0:8003'
    configure_address = 'http://0.0.0.0:8004'
    notify_address = 'http://0.0.0.0:8006'

def take_new_screenshot(watcher_id, url, server_file_paths):
    # print(f'{watcher_id}: New screenshot thread {threading.get_ident()}')
    server_file_path_new_screenshot = os.path.join('files', f'{watcher_id}.png')
    server_file_path_new_screenshot = os.path.abspath(server_file_path_new_screenshot)
    with requests.get(f'{screenshot_address}/screenshot', json={'url':url}) as response:
        with open(server_file_path_new_screenshot, 'wb') as file:
            file.write(response.content)

    server_file_paths['new'] = server_file_path_new_screenshot



def get_old_screenshot(watcher_id, server_file_paths):
    # print(f'{watcher_id}: Old screenshot thread {threading.get_ident()}')
    server_file_path_old_screenshot = os.path.join('files', f'{watcher_id}_old.png')
    server_file_path_old_screenshot = os.path.abspath(server_file_path_old_screenshot)
    with requests.get(f'{cloud_object_storage_service_address}/files/{watcher_id}.png') as response:
        with open(server_file_path_old_screenshot, 'wb') as file:
            file.write(response.content)

    server_file_paths['old'] = server_file_path_old_screenshot


def update_old_screenshot(server_file_path):
    files = {'file': open(server_file_path, 'rb')}
    requests.post(f'{cloud_object_storage_service_address}/files', files=files) 

def get_difference(server_file_paths):
    files = {
        'file_old': open(server_file_paths['old'], 'rb'),
        'file_new': open(server_file_paths['new'], 'rb')
    }
    with requests.get(f'{compare_service_address}/difference' , files=files) as response:
        difference = float(response.text)
    
    return difference

def notify(user_id, url, server_file_paths):

    # Get difference image
    files = {
        'file_old': open(server_file_paths['old'], 'rb'),
        'file_new': open(server_file_paths['new'], 'rb')
    }
    difference_image_path = os.path.join('files', f'{uuid.uuid4()}.png')
    with requests.get(f'{compare_service_address}/difference_image', files=files) as response:
        open(difference_image_path, 'wb').write(response.content)


    files = {
            'file': open(difference_image_path, 'rb')
    }
    payload = {
        'url': url,
        'email': ''
    }
    # user email
    with requests.get(f'{configure_address}/users/{user_id}') as response:
        data = response.json()
        payload['email'] = data['email']

    # Notify
    r = requests.post(f'{notify_address}/notify', files=files, data=payload)

    os.remove(difference_image_path)

def update_last_run(watcher_id, now):
    payload = {
        'last_run': now
    }
    requests.put(f'{configure_address}/watchers/{watcher_id}', json = payload)

def cleanup(server_file_paths):
    os.remove(server_file_paths['new'])
    os.remove(server_file_paths['old'])