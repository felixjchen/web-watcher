
import os
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
    file.save(server_file_path)

    # Upload file to COS
    multi_part_upload(server_file_path, file_ID)

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
    server_file_path = f'./files/{file_ID}'

    get_item(server_file_path, file_ID)

    # Serve file
    return send_file(server_file_path, mimetype='image/gif')


if __name__ == "__main__":
    app.run('127.0.0.1', port=8001, debug=True)
