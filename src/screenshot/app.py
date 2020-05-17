from gevent import monkey
monkey.patch_all()

import os
import io
import uuid
from screenshot import get_screenshot
from flask import Flask, send_file, request

app = Flask(__name__)


@app.route('/screenshot', methods=['GET'])
def screenshot():
    """ Return an screenshot file with name file_ID at url 

    Args:
        url: url for screenshot

    Returns:
        File for success

    """

    # Get payload data, create local file path
    data = request.json
    file_ID = f'{uuid.uuid4()}.png'
    file_path = os.path.join('files', file_ID)
    url = data['url']

    get_screenshot(url, file_path)

    # Buffer file into memmory
    file_buffer = io.BytesIO()
    with open(file_path, 'rb') as f:
        file_buffer.write(f.read())
    file_buffer.seek(0)
    os.remove(file_path)

    return send_file(file_buffer, mimetype='image/gif')


if __name__ == "__main__":
    app.run('0.0.0.0', port=8003, debug=True)
