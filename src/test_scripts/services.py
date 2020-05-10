import os
import requests
import time

import asyncio


production = 'KUBERNETES_SERVICE_HOST' in os.environ


def get_address(host, port):
    return f'http://{host}:{port}'


if production:
    cloud_object_storage_service_host = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_HOST']
    cloud_object_storage_service_port = os.environ['CLOUD_OBJECT_STORAGE_SERVICE_PORT']
    cloud_object_storage_service_address = get_address(
        cloud_object_storage_service_host, cloud_object_storage_service_port)

    compare_image_service_host = os.environ['COMPARE_IMAGE_SERVICE_HOST']
    compare_image_service_port = os.environ['COMPARE_IMAGE_SERVICE_PORT']
    compare_image_service_address = get_address(
        compare_image_service_host, compare_image_service_port)

    screenshot_host = os.environ['SCREENSHOT_SERVICE_HOST']
    screenshot_port = os.environ['SCREENSHOT_SERVICE_PORT']
    screenshot_address = get_address(
        screenshot_host, screenshot_port)
else:
    cloud_object_storage_service_address = 'http://0.0.0.0:8001'
    compare_image_service_address = 'http://0.0.0.0:8002'
    screenshot_address = 'http://0.0.0.0:8003'


def test_1():
    ''' This test case gets a screenshot of youtube.com as new.png, uploads and downloads it from COS as old.png and creates a difference image (from new.png and old.png) called difference.png. Finnally, difference image should be the same as both new.png and old.png'''

    # TEST Screenshot
    payload = {
        'url': 'http://www.facebook.com',
    }
    r = requests.get(f'{screenshot_address}/screenshot', json=payload)
    open('files/test_1.png', 'wb').write(r.content)

    # TEST COS
    # UP
    files = {'file': open('files/test_1.png', 'rb')}
    r = requests.post(
        f'{cloud_object_storage_service_address}/file', files=files)

    # DOWN
    r = requests.get(
        f'{cloud_object_storage_service_address}/file/test_1.png')
    open('files/test_1_old.png', 'wb').write(r.content)

    # TEST Compare
    # Get difference image
    files = {
        'file_old': open('files/test_1_old.png', 'rb'),
        'file_new': open('files/test_1.png', 'rb')
    }
    r = requests.get(
        f'{compare_image_service_address}/difference_image', files=files)
    open('files/test_1_difference.png', 'wb').write(r.content)

    # Get difference
    files = {
        'file_old': open('files/test_1_old.png', 'rb'),
        'file_new': open('files/test_1_difference.png', 'rb')
    }

    r = requests.get(
        f'{compare_image_service_address}/difference', files=files)
    return float(r.text) == 0


def test_2():
    ''' '''

    # TEST Screenshot
    payload = {
        'url': 'http://www.youtube.com',
    }
    r = requests.get(f'{screenshot_address}/screenshot', json=payload)
    open('files/YT1.png', 'wb').write(r.content)
    r = requests.get(f'{screenshot_address}/screenshot', json=payload)
    open('files/YT2.png', 'wb').write(r.content)

    # TEST Compare
    # Get difference image
    files = {
        'file_old': open('files/YT1.png', 'rb'),
        'file_new': open('files/YT2.png', 'rb')
    }
    r = requests.get(
        f'{compare_image_service_address}/difference_image', files=files)
    open('files/YT_difference.png', 'wb').write(r.content)

    # Get difference
    files = {
        'file_old': open('files/YT1.png', 'rb'),
        'file_new': open('files/YT2.png', 'rb')
    }
    r = requests.get(
        f'{compare_image_service_address}/difference', files=files)
    return float(r.text) > 0


if __name__ == "__main__":

    start = time.perf_counter()

    assert test_1()
    assert test_2()

    elapsed = time.perf_counter() - start
    print(f'Took {elapsed} seconds')
