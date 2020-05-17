from gevent import monkey
monkey.patch_all()

import os
from flask import Flask, request
from werkzeug.utils import secure_filename
from notify import send_email

app = Flask(__name__)

@app.route('/notify', methods=['POST'])
def set_file():

    # Save file
    file = request.files['file']
    file_ID = secure_filename(file.filename)
    server_file_path = os.path.join('files', file_ID)
    server_file_path = os.path.abspath(server_file_path)
    file.save(server_file_path)

    # print(request.form)
    url = request.form['url']
    email = request.form['email']

    send_email(email, url, server_file_path)

    # Remove file
    os.remove(server_file_path)

    return 'Success'


if __name__ == "__main__":
    app.run('0.0.0.0', port=8006, debug=True)
