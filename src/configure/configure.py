import os
import requests
import uuid
import time
from cloudant import cloudant
from cloudant.document import Document

production = 'KUBERNETES_SERVICE_HOST' in os.environ

if production:
    def get_address(host, port):
        return f'http://{host}:{port}'

    cloud_object_storage_service_host = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_HOST']
    cloud_object_storage_service_port = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_PORT']
    cloud_object_storage_service_address = get_address(
        cloud_object_storage_service_host, cloud_object_storage_service_port)

    screenshot_host = os.environ['SCREENSHOT_SERVICE_HOST']
    screenshot_port = os.environ['SCREENSHOT_SERVICE_PORT']
    screenshot_address = get_address(
        screenshot_host, screenshot_port)

    USERNAME = os.environ['SECRET_USERNAME']
    PASSWORD = os.environ['SECRET_PASSWORD']
    URL = os.environ['SECRET_URL']
else:
    cloud_object_storage_service_address = 'http://0.0.0.0:8001'
    screenshot_address = 'http://0.0.0.0:8003'

    from secrets import credentials
    # Credentials for db
    USERNAME = credentials['username']
    PASSWORD = credentials['password']
    URL = credentials['url']


def add_user(name, email):
    """
    user_ID (UUID) : {
        name : string
        email : string
        watchers : [watcher1, .. watcherI]
    }   
    """

    new_uuid = str(uuid.uuid4())
    new_user = {
        "name": name,
        "email": email,
        "watchers": []
    }

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "users") as document:

            users = document["users"]
            users[new_uuid] = new_user

    return new_uuid

def delete_user(user_id):

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        watchers = []
        with Document(db, "users") as document:
            users = document["users"]
            watchers = users[user_id]['watchers']

        for watcher_id in watchers: 
            delete_watcher(watcher_id)

        # Otherwise document conflict
        with Document(db, "users") as document:
            del(document["users"][user_id])

def update_user(user_id, name=None, email=None):

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "users") as document:

            user = document["users"][user_id]

            if name:
                user['name'] = name
            
            if email:
                user['email'] = email




def get_user(user_id):

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "users") as document:

            users = document["users"]

            if user_id not in users:
                return False

            return users[user_id]


def list_users():

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "users") as document:
            return document["users"]


def add_watcher(user_id, url, frequency):

    watcher_uuid = str(uuid.uuid4())
    last_run = int(time.time())
    new_watcher = {
        'user_id': user_id,
        'url': url,
        'frequency': frequency,
        'last_run': last_run
    }

    # FIRST TIME SCREENSHOT
    server_file_path = os.path.join('files', f'{watcher_uuid}.png')
    r = requests.get(f'{screenshot_address}/screenshot', json={'url': url})
    open(server_file_path, 'wb').write(r.content)

    # Upload to COS
    files = {'file': open(server_file_path, 'rb')}
    r = requests.post(
        f'{cloud_object_storage_service_address}/files', files=files)
    os.remove(server_file_path)

    # Add watcher to use
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "users") as document:
            users = document["users"]
            users[user_id]['watchers'] += [watcher_uuid]

        # Add watcher to watchers
        with Document(db, "watchers") as document:
            watchers = document['watchers']
            watchers[watcher_uuid] = new_watcher

    return watcher_uuid, last_run

def delete_watcher(watcher_id):
    requests.delete(f'{cloud_object_storage_service_address}/files/{watcher_id}.png')

    # Add watcher to use
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        user_id = ''

        # Add watcher to watchers
        with Document(db, "watchers") as document:
            user_id = document['watchers'][watcher_id]['user_id']
            del(document['watchers'][watcher_id])

        with Document(db, "users") as document:
            users = document["users"]
            users[user_id]["watchers"].remove(watcher_id)
        
    return True


def update_watcher(watcher_id, last_run=None, frequency=None, url=None):

    # Add watcher to use
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        # Add watcher to watchers
        with Document(db, "watchers") as document:
            watchers = document['watchers']
            watcher = watchers[watcher_id]

            if last_run:
                watcher['last_run'] = last_run

            if frequency:
                watcher['frequency'] = frequency

            if url:
                watcher['url'] = url

    return True


def get_watcher(watcher_id):

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "watchers") as document:

            watchers = document["watchers"]

            if watcher_id not in watchers:
                return False

            return watchers[watcher_id]


def list_watchers():

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client['configuration']

        with Document(db, "watchers") as document:
            return document['watchers']


if __name__ == "__main__":
    # add_user("Felix", "felixchen1998@gmail.com")
    # felix_id = "0f5e3e25-9cc6-4d60-9faf-f7157abc1b69"
    # # print(list_users())
    # # print(get_user(felix_id))

    # # print(list_watchers())
    # # add_watcher(felix_id, 'http://www.youtube.com', 86400)
    # print(list_users())
    # print(list_watchers())
    # print(get_watcher('e0aab339-7572-489d-8e8e-50fe741697a6'))
    pass
