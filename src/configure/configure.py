import os
import requests
import uuid
import time
import bcrypt

from theading import Thread

from cloudant import cloudant
from cloudant.document import Document

production = 'KUBERNETES_SERVICE_HOST' in os.environ
db_client = 'production' if production else 'development'

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


def hash_string(clear_text):
    salt = bcrypt.gensalt(rounds=4)
    clear_text = str.encode(clear_text)
    hash_text = bcrypt.hashpw(clear_text, salt).decode()
    return hash_text


def first_screenshot(watcher_uuid, url):
    # FIRST TIME SCREENSHOT
    # Get new SS
    server_file_path = os.path.join('files', f'{watcher_uuid}.png')
    r = requests.get(f'{screenshot_address}/screenshot', json={'url': url})
    open(server_file_path, 'wb').write(r.content)
    # Upload to COS
    files = {'file': open(server_file_path, 'rb')}
    r = requests.post(
        f'{cloud_object_storage_service_address}/files', files=files)
    os.remove(server_file_path)


def add_user(email, password):
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]
        with Document(db, "user") as document:
            users = document["users"]
            if email in users:
                return -1
            hashed_password = hash_string(password)
            new_user = {
                'password': password,
                "watchers": []
            }
            users[email] = new_user

    return 1


def update_password(email, password):
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]
        with Document(db, "user") as document:
            document["users"][email]["password"] = hash_string(password)
    return True


def check_password(email, password):
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]
        with Document(db, "user") as document:

            users = document["users"]

            if email not in users:
                return -1

            hashed_password = users[email]["password"]
            password = str.encode(password)
            hashed_password = str.encode(hashed_password)
            if bcrypt.checkpw(password, hashed_password):
                return 1
            else:
                return -2

    return -3


def get_user(email):
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]
        with Document(db, "user") as document:
            users = document["users"]
            if email not in users:
                return -1
            return users[email]
    return -1


def delete_user(email):
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]
        watchers = []
        with Document(db, "user") as document:
            watchers = document["users"][email]['watchers']

        for watcher_id in watchers:
            delete_watcher(watcher_id)

        with Document(db, "users") as document:
            del(document["users"][email])


def add_watcher(email, url, frequency):

    watcher_uuid = str(uuid.uuid4())
    last_run = int(time.time())
    new_watcher = {
        'email': email,
        'url': url,
        'frequency': frequency,
        'last_run': last_run
    }

    Thread(target=first_screenshot, args=(watcher_uuid, url,)).start()

    # Add to database
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:
        db = client[db_client]

        # Add watcher to user
        with Document(db, "user") as document:
            document["users"][email]['watchers'] += [watcher_uuid]

        # Add watcher to watchers
        with Document(db, "watcher") as document:
            watchers = document['watchers']
            watchers[watcher_uuid] = new_watcher

    return watcher_uuid, last_run


def delete_watcher(watcher_id):
    requests.delete(
        f'{cloud_object_storage_service_address}/files/{watcher_id}.png')

    # Add watcher to use
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client[db_client]
        email = ''

        # Remove watcher to watchers
        with Document(db, "watchers") as document:
            email = document['watchers'][watcher_id]['email']
            del(document['watchers'][watcher_id])

        with Document(db, "user") as document:
            document["users"][email]["watchers"].remove(watcher_id)

    return True


def update_watcher(watcher_id, last_run=None, frequency=None, url=None):

    # Add watcher to use
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client[db_client]

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

        db = client[db_client]

        with Document(db, "watchers") as document:

            watchers = document["watchers"]

            if watcher_id not in watchers:
                return False

            return watchers[watcher_id]


def _delete_all():
    users = []
    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client[db_client]

        with Document(db, "user") as document:
            document["users"] = {}

        with Document(db, "watcher") as document:
            document["watchers"] = {}


def list_users():

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client[db_client]

        with Document(db, "users") as document:
            return document["users"]


def list_watchers():

    with cloudant(USERNAME, PASSWORD, url=URL, connect=True, auto_renew=True) as client:

        db = client[db_client]

        with Document(db, "watchers") as document:
            return document['watchers']


if __name__ == "__main__":
    e = 'felixchen@gmail.com'
    r = add_user(e, 'adjslajdkl')
    print(update_password(e, 'abc'))
    print(check_password(e, 'adjslajdkl'))
    print(check_password(e, 'abc'))
    print(get_user(e))
