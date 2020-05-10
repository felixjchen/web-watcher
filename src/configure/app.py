import os
import uuid
import requests
from flask import Flask, jsonify, request
from configure import add_user, list_users, get_user, add_watcher, list_watchers, get_watcher

app = Flask(__name__)

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
else:
    cloud_object_storage_service_address = 'http://0.0.0.0:8001'
    screenshot_address = 'http://0.0.0.0:8003'


@app.route('/users', methods=['GET', 'POST'])
def users():

    # Get all users
    if request.method == 'GET':
        return jsonify(list_users())

    # Add new user
    data = request.json
    name = data['name']
    email = data['email']

    user_id = add_user(name, email)

    return f'Successly created user {user_id}'


@app.route('/users/<user_id>')
def user_profile(user_id):
    return jsonify(get_user(user_id))


@app.route('/watchers', methods=['GET', 'POST'])
def watchers():

    # Get all watchers
    if request.method == 'GET':
        return jsonify(list_watchers())

    # Create new watcher
    data = request.json
    user_id = data['user_id']
    url = data['url']
    frequency = data['frequency']

    watcher_id = add_watcher(user_id, url, frequency)

    # FIRST TIME SCREENSHOT
    server_file_path = os.path.join('files', f'{watcher_id}.png')
    r = requests.get(f'{screenshot_address}/screenshot', json=data)
    open(server_file_path, 'wb').write(r.content)
    # Upload to COS
    files = {'file': open(server_file_path, 'rb')}
    r = requests.post(
        f'{cloud_object_storage_service_address}/file', files=files)
    os.remove(server_file_path)

    return f'Succesfully created watcher {watcher_id}'


@app.route('/watchers/<watcher_id>')
def watcher_profile(watcher_id):
    return jsonify(get_watcher(watcher_id))


if __name__ == "__main__":
    app.run('0.0.0.0', 8004, debug=True)
