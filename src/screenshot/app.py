
import os
from screenshot import get_screenshot
from flask import Flask, send_file, request

app = Flask(__name__)


@app.route('/screenshot', methods=['POST'])
def screenshot():
    """ Return an screenshot file with name file_ID at url 

    Args:
        file_ID: the file_ID for file 
        url: url for screenshot

    Returns:
        File for success

    """

    # Get payload data, create local file path
    data = request.json
    file_ID = data['file_ID']
    file_path = os.path.join('files', file_ID)
    url = data['url']

    get_screenshot(url, file_path)

    return send_file(file_path)


if __name__ == "__main__":
    app.run('0.0.0.0', port=8002, debug=True)
