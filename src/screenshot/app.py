
import os
from screenshot import get_screenshot

from flask import Flask, send_file, request
from screenshot import get_screenshot
import os

app = Flask(__name__)

@app.route('/screenshot', methods=['POST'])
def screenshot():
    data = request.json
    file_ID = data['file_ID']
    file_path = os.path.join('files', file_ID)
    url = data['url']

    get_screenshot(url, file_path)

    return send_file(file_path)


if __name__ == "__main__":
    app.run('0.0.0.0', port=8002, debug=True)
