from gevent import monkey
monkey.patch_all()

import os
import uuid
import io
from cos import multi_part_upload, get_item, delete_item

from flask import Flask, request, send_file
from werkzeug.utils import secure_filename

app = Flask(__name__)


@app.route('/files', methods=['POST'])
def set_file():
    """ Sets the file in ibm cos bucket

    Args:
        file: the file object

    Returns:
        'Success' for success

    """
    # Save file
    file = request.files['file']
    file_ID = secure_filename(file.filename)
    server_file_path = os.path.join('files', file_ID)
    server_file_path = os.path.abspath(server_file_path)
    file.save(server_file_path)

    # Upload file to COS
    multi_part_upload(server_file_path, file_ID)

    # Remove file
    os.remove(server_file_path)

    return 'Success'


@app.route('/files/<file_id>', methods=['GET', 'DELETE'])
def get_file(file_id):
    """ GET the file in ibm cos bucket with file_id

    Args:
        file_id: the file_id for file 

    Returns:
        File for success

    """

    if request.method == 'GET':
        server_file_path = os.path.join('files', file_id)

        get_item(server_file_path, file_id)

        # Buffer file into memmory
        file_buffer = io.BytesIO()
        with open(server_file_path, 'rb') as f:
            file_buffer.write(f.read())
        file_buffer.seek(0)
        os.remove(server_file_path)

        return send_file(file_buffer, mimetype='image/gif')

    if request.method == 'DELETE':

        result = delete_item(file_id)

        if result:
            return f'Succesfully deleted {file_id}'

    return 'Something went wrong'


if __name__ == "__main__":
    app.run('0.0.0.0', port=8001, debug=True)
