from configure import add_user, update_password, check_password, get_user, delete_user, add_watcher, delete_watcher, get_watcher, update_watcher, update_user, list_users, list_watchers
from flask_cors import CORS
from flask import Flask, jsonify, request
from gevent import monkey
monkey.patch_all()


app = Flask(__name__)
CORS(app)


@app.route('/users', methods=['GET', 'POST'])
def users():

    # Get all users
    if request.method == 'GET':
        return jsonify(list_users())

    if request.method == 'POST':
        # Add new user
        data = request.json
        name = data['name']
        email = data['email']

        user_id = add_user(name, email)

        return jsonify({
            'message': f'CREATED user {user_id}',
            'user_id': user_id
        })

    return 'Error'


@app.route('/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
def user_profile(user_id):

    if request.method == 'GET':
        return jsonify(get_user(user_id))

    if request.method == 'PUT':
        update_user(user_id, **request.json)

        return jsonify({
            'message': f'UPDATED user {user_id}',
            'user_id': user_id
        })

    if request.method == 'DELETE':
        delete_user(user_id)

        return jsonify({
            'message': f'DELETED user {user_id}',
            'user_id': user_id
        })

    return 'Error'


@app.route('/watchers', methods=['GET', 'POST'])
def watchers():

    # Get all watchers
    if request.method == 'GET':
        return jsonify(list_watchers())

    # Create new watcher
    if request.method == 'POST':
        data = request.json
        user_id = data['user_id']
        url = data['url']
        frequency = data['frequency']

        watcher_id, last_run = add_watcher(user_id, url, frequency)

        return jsonify({
            'message': f'CREATED watcher {watcher_id}',
            'watcher_id': watcher_id,
            'last_run': last_run
        })

    return 'Error'


@app.route('/watchers/<watcher_id>', methods=['GET', 'PUT', 'DELETE'])
def watcher_profile(watcher_id):

    # Get watcher
    if request.method == 'GET':
        return jsonify(get_watcher(watcher_id))

    # Update watcher
    if request.method == 'PUT':
        data = request.json
        last_run = data.get('last_run')
        url = data.get('url')
        frequency = data.get('frequency')

        update_watcher(watcher_id, last_run, frequency, url)

        return jsonify({
            'message': f'UPDATED watcher {watcher_id}',
            'watcher_id': watcher_id
        })

    if request.method == 'DELETE':
        delete_watcher(watcher_id)

        return jsonify({
            'message': f'DELETED watcher {watcher_id}',
            'watcher_id': watcher_id
        })

    return 'Error'


if __name__ == "__main__":
    app.run('0.0.0.0', 8004, debug=True)
