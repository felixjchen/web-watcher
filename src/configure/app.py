if True:
    from gevent import monkey
    monkey.patch_all()

from configure import add_user, update_password, check_password, get_user, delete_user, add_watcher, delete_watcher, get_watcher, update_watcher,  list_users, list_watchers
from flask import Flask, jsonify, request


app = Flask(__name__)


@app.route('/users', methods=['GET', 'POST'])
def users():

    # Get all users
    if request.method == 'GET':
        return jsonify(list_users())

    if request.method == 'POST':
        # Add new user
        email = request.args.get('email')
        if not email: return 'Missing email'
        password = request.args.get('password')
        if not password: return 'Missing password'

        user_id = add_user(email, password)

        return jsonify({
            'message': f'CREATED with email {email}',
            'email': email
        })

    return 'Error'


@app.route('/users/<email>', methods=['GET', 'PUT', 'DELETE'])
def user_profile(email):

    if request.method == 'GET':
        # Don't show password
        user = get_user(email)
        del user['password']
        return jsonify(user)

    if request.method == 'PUT':
        update_password(email, request.args.get('password'))

        return jsonify({
            'message': f'UPDATED user {email}',
            'user_id': email
        })

    if request.method == 'DELETE':
        delete_user(email)

        return jsonify({
            'message': f'DELETED user {email}',
            'user_id': email
        })

    return 'Error'

@app.route('/auth', methods=['GET'])
def auth():
    if request.method == 'GET':
        email = request.args.get('email')
        if not email: return 'Missing email'
        password = request.args.get('password')
        if not password: return 'Missing password'

        result = check_password(email, password)

        if result == -1:
            return 'User does not exist'
        elif result == -2:
            return 'Wrong password'
        elif result == 1:
            return 'Authenticated'

    return 'Error' 


@app.route('/watchers', methods=['GET', 'POST'])
def watchers():

    # Get all watchers
    if request.method == 'GET':
        return jsonify(list_watchers())

    # Create new watcher
    if request.method == 'POST':

        email = request.args.get('email')
        if not email: return 'Missing email'

        url = request.args.get('url')
        if not url: return 'Missing url'

        frequency = request.args.get('frequency')
        if frequency is not int: frequency = int(frequency)
        if not frequency: return 'Missing frequency'

        watcher_id, last_run = add_watcher(email, url, frequency)

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
        last_run = request.args.get('last_run')
        if last_run is not None and last_run is not int: last_run = int(last_run)
        frequency = request.args.get('frequency')
        if frequency is not None and frequency is not int: frequency = int(frequency)

        update_watcher(watcher_id, last_run, frequency)

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
