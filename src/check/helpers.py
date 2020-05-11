import requests
import os
import threading

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


    NOTIFIER_APIKEY = os.environ['SECRET_APIKEY']
else:
    cloud_object_storage_service_address = 'http://0.0.0.0:8001'
    compare_service_address = 'http://0.0.0.0:8002'
    screenshot_address = 'http://0.0.0.0:8003'
    configure_address = 'http://0.0.0.0:8004'
    from secrets import credentials

    NOTIFIER_APIKEY = credentials['apikey']

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
    with requests.get(f'{cloud_object_storage_service_address}/file/{watcher_id}.png') as response:
        with open(server_file_path_old_screenshot, 'wb') as file:
            file.write(response.content)

    server_file_paths['old'] = server_file_path_old_screenshot


def update_old_screenshot(server_file_path):
    files = {'file': open(server_file_path, 'rb')}
    requests.post(f'{cloud_object_storage_service_address}/file', files=files) 

def get_difference(server_file_paths):
    files = {
        'file_old': open(server_file_paths['old'], 'rb'),
        'file_new': open(server_file_paths['new'], 'rb')
    }
    with requests.get(f'{compare_service_address}/difference' , files=files) as response:
        difference = float(response.text)
    
    return difference

def notify(user_id, url):
    # print(f'NOTIFYING USER {user_id}')
    with requests.get(f'{configure_address}/users/{user_id}') as response:
        data = response.json()

        email = data['email']

        payload = {
            'alertType': 'email',
            'apikey': NOTIFIER_APIKEY,
            'address': email,
            'subject': 'web-watcher notification',
            'body': f'{url} has changed'
        }
        response = requests.post("https://us-east.functions.cloud.ibm.com/api/v1/web/f20b7584-b5de-4512-b3fa-904a2ca64acd/default/alerter", data=payload)


def update_last_run(watcher_id, now):
    payload = {
        'last_run': now
    }
    requests.put(f'{configure_address}/watchers/{watcher_id}', json = payload)

def cleanup(server_file_paths):
    os.remove(server_file_paths['new'])
    os.remove(server_file_paths['old'])