import os
import time

import asyncio
from aiohttp import ClientSession


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


async def test_1(session):
    ''' This test case gets a screenshot of youtube.com as new.png, uploads and downloads it from COS as old.png and creates a difference image (from new.png and old.png) called difference.png. Finnally, difference image should be the same as both new.png and old.png with an difference index of 0'''

    # TEST Screenshot
    payload = {
        'url': 'http://www.facebook.com',
    }

    async with session.post(f'{screenshot_address}/screenshot', json=payload) as response:
        file = await response.read()
        open('files/new.png', 'wb').write(file)

    # TEST COS
    # UP
    files = {'file': open('files/new.png', 'rb')}
    r = await session.post(
        f'{cloud_object_storage_service_address}/set', data=files)

    # DOWN
    payload = {
        'file_ID':  'new.png'
    }
    async with session.post(f'{cloud_object_storage_service_address}/get', json=payload) as response:
        file = await response.read()
        open('files/old.png', 'wb').write(file)

    # TEST Compare
    # Get difference image
    files = {
        'file_old': open('files/old.png', 'rb'),
        'file_new': open('files/new.png', 'rb')
    }

    async with session.post(f'{compare_image_service_address}/difference_image', data=files) as response:
        file = await response.read()
        open('files/difference.png', 'wb').write(file)

    # Get difference
    files = {
        'file_old': open('files/old.png', 'rb'),
        'file_new': open('files/difference.png', 'rb')
    }
    r = 1
    async with session.post(f'{compare_image_service_address}/difference', data=files) as response:
        r = await response.text()
        r = float(r)

    return r == 0


async def test_2(session):
    ''' This test case gets two screenshots of youtube.com as YT1.png, YT2.png. Then creates the difference image and gets the difference index of both Youtube screenshots, ideally these two images are different because youtube will recommend different videos for seperate instances.'''

    # TEST Screenshot
    payload = {
        'url': 'http://www.youtube.com',
    }
    async with session.post(f'{screenshot_address}/screenshot', json=payload) as response:
        file = await response.read()
        open('files/YT1.png', 'wb').write(file)

    async with session.post(f'{screenshot_address}/screenshot', json=payload) as response:
        file = await response.read()
        open('files/YT2.png', 'wb').write(file)

    # TEST Compare
    # Get difference image
    files = {
        'file_old': open('files/YT1.png', 'rb'),
        'file_new': open('files/YT2.png', 'rb')
    }
    async with session.post(f'{compare_image_service_address}/difference_image', data=files) as response:
        file = await response.read()
        open('files/difference.png', 'wb').write(file)

    # Get difference
    files = {
        'file_old': open('files/YT1.png', 'rb'),
        'file_new': open('files/YT2.png', 'rb')
    }
    r = 0
    async with session.post(f'{compare_image_service_address}/difference', data=files) as response:
        r = await response.text()
        r = float(r)

    return r > 0


async def main():
    async with ClientSession() as session:
        await asyncio.gather(test_1(session), test_2(session))


if __name__ == "__main__":

    start = time.perf_counter()

    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()

    elapsed = time.perf_counter() - start
    print(f'Took {elapsed} seconds')
