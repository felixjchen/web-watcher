import requests

url = 'http://0.0.0.0:8001'
files = {'file': open('100303030222.png', 'rb')}


# r = requests.post(f'{url}/set', files=files)
# print(r.status_code)


payload = {
    'file_ID':  '100303030222.png'
}

r = requests.post(f'{url}/get', json=payload)
open('test.png', 'wb').write(r.content)
