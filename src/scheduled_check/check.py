import os


def get_address(host, port):
    return f'http://{host}:{port}'


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
print(cloud_object_storage_service_address,
      compare_image_service_address, screenshot_address)
#environ({'KUBERNETES_PORT': 'tcp://10.96.0.1:443', 'KUBERNETES_SERVICE_PORT': '443', 'HOSTNAME': 'scheduled-check-job-1588774800-ntnnj', 'COMPARE_IMAGE_SERVICE_PORT': 'tcp://10.111.157.0:80', 'COMPARE_IMAGE_SERVICE_SERVICE_PORT': '80', 'CLOUD_OBJECT_STORAGE_SERVICE_PORT_80_TCP': 'tcp://10.103.46.174:80', 'PYTHON_PIP_VERSION': '20.1', 'SHLVL': '1', 'HOME': '/root', 'GPG_KEY': '0D96DF4D4110E5C43FBFB17F2D347EA6AA65421D', 'COMPARE_IMAGE_SERVICE_PORT_80_TCP_ADDR': '10.111.157.0', 'SCREENSHOT_SERVICE_SERVICE_HOST': '10.99.6.124', 'COMPARE_IMAGE_SERVICE_PORT_80_TCP_PORT': '80', 'COMPARE_IMAGE_SERVICE_PORT_80_TCP_PROTO': 'tcp', 'PYTHON_GET_PIP_URL': 'https://github.com/pypa/get-pip/raw/1fe530e9e3d800be94e04f6428460fc4fb94f5a9/get-pip.py', 'SCREENSHOT_SERVICE_PORT': 'tcp://10.99.6.124:80', 'SCREENSHOT_SERVICE_SERVICE_PORT': '80', 'CLOUD_OBJECT_STORAGE_SERVICE_SERVICE_HOST': '10.103.46.174', 'KUBERNETES_PORT_443_TCP_ADDR': '10.96.0.1', 'PATH': '/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'KUBERNETES_PORT_443_TCP_PORT': '443', 'COMPARE_IMAGE_SERVICE_PORT_80_TCP': 'tcp://10.111.157.0:80', 'KUBERNETES_PORT_443_TCP_PROTO': 'tcp', 'SCREENSHOT_SERVICE_PORT_80_TCP_ADDR': '10.99.6.124', 'LANG': 'C.UTF-8', 'CLOUD_OBJECT_STORAGE_SERVICE_SERVICE_PORT': '80', 'CLOUD_OBJECT_STORAGE_SERVICE_PORT': 'tcp://10.103.46.174:80', 'SCREENSHOT_SERVICE_PORT_80_TCP_PORT': '80', 'SCREENSHOT_SERVICE_PORT_80_TCP_PROTO': 'tcp', 'PYTHON_VERSION': '3.7.7', 'KUBERNETES_SERVICE_PORT_HTTPS': '443', 'KUBERNETES_PORT_443_TCP': 'tcp://10.96.0.1:443', 'CLOUD_OBJECT_STORAGE_SERVICE_PORT_80_TCP_ADDR': '10.103.46.174', 'KUBERNETES_SERVICE_HOST': '10.96.0.1', 'PWD': '/', 'PYTHON_GET_PIP_SHA256': 'ce486cddac44e99496a702aa5c06c5028414ef48fdfd5242cd2fe559b13d4348', 'CLOUD_OBJECT_STORAGE_SERVICE_PORT_80_TCP_PORT': '80', 'SCREENSHOT_SERVICE_PORT_80_TCP': 'tcp://10.99.6.124:80', 'CLOUD_OBJECT_STORAGE_SERVICE_PORT_80_TCP_PROTO': 'tcp', 'COMPARE_IMAGE_SERVICE_SERVICE_HOST': '10.111.157.0'})
