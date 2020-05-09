
import os
import uuid
import io
from cos import multi_part_upload, get_item

from flask import Flask, request, send_file
from werkzeug.utils import secure_filename

app = Flask(__name__)


@app.route('/set', methods=['POST'])
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
    print(server_file_path)
    os.remove(server_file_path)

    return 'Success'


@app.route('/get', methods=['POST'])
def get_file():
    """ GET the file in ibm cos bucket with file_ID

    Args:
        file_ID: the file_ID for file 

    Returns:
        File for success

    """
    data = request.json
    file_ID = data['file_ID']
    server_file_path = os.path.join('files', file_ID)

    get_item(server_file_path, file_ID)

    # Buffer file into memmory
    file_buffer = io.BytesIO()
    with open(server_file_path, 'rb') as f:
        file_buffer.write(f.read())
    file_buffer.seek(0)
    os.remove(server_file_path)

    return send_file(file_buffer, mimetype='image/gif')


if __name__ == "__main__":
    app.run('0.0.0.0', port=8001, debug=True)
