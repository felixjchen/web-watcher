import os
from flask import Flask, request, send_file
from werkzeug.utils import secure_filename
from compare_image import get_difference, create_difference_image

app = Flask(__name__)


@app.route('/difference', methods=['POST'])
def difference():
    """ Gets the structural similarity index between two images

    Args:
        file_old: the old file object
        file_new: the new file object

    Returns:
        Image structural similarity index

    """
    file_old = request.files['file_old']
    file_ID_old = secure_filename(file_old.filename)
    file_path_old = os.path.join('files', file_ID_old)
    file_path_old = os.path.abspath(file_path_old)
    file_old.save(file_path_old)

    file_new = request.files['file_new']
    file_ID_new = secure_filename(file_new.filename)
    file_path_new = os.path.join('files', file_ID_new)
    file_path_new = os.path.abspath(file_path_new)
    file_new.save(file_path_new)

    return str(get_difference(file_path_old, file_path_new))


@app.route('/difference_image', methods=['POST'])
def difference_image():
    """ Gets an image with bounding boxes with the difference between file_old and file_new

    Args:
        file_old: the old file object
        file_new: the new file object

    Returns:
        difference image with bounding boxes
    """
    file_old = request.files['file_old']
    file_ID_old = secure_filename(file_old.filename)
    file_path_old = os.path.join('files', file_ID_old)
    file_path_old = os.path.abspath(file_path_old)
    file_old.save(file_path_old)

    file_new = request.files['file_new']
    file_ID_new = secure_filename(file_new.filename)
    file_path_new = os.path.join('files', file_ID_new)
    file_path_new = os.path.abspath(file_path_new)
    file_new.save(file_path_new)

    file_path_difference = os.path.join(
        'files', f'{file_ID_new.replace(".png","")}_difference.png')

    create_difference_image(file_path_old, file_path_new, file_path_difference)

    return send_file(file_path_difference, mimetype='image/gif')


if __name__ == "__main__":
    app.run('0.0.0.0', port=8002, debug=True)
