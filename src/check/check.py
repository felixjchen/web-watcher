import os
import requests


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


pass
if __name__ == "__main__":
    pass
