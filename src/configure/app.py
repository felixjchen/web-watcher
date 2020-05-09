from flask import Flask, jsonify, request
from configure import add_user, list_users, get_user, add_watcher, list_watchers, get_watcher

app = Flask(__name__)


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

    # TODO NEED TO DO FIRST TIME SCREENSHOT

    return f'Succesfully created watcher {watcher_id}'


@app.route('/watchers/<watcher_id>')
def watcher_profile(watcher_id):
    return jsonify(get_watcher(watcher_id))


if __name__ == "__main__":
    app.run('0.0.0.0', 8004, debug=True)
