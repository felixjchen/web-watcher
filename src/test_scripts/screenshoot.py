import requests

url = 'http://0.0.0.0:80'
payload = {
    'url': 'http://www.facebook.com',
    'file_ID':  '10030303044.png'
}

r = requests.post(f'{url}/screenshot', json=payload)
open('10030303044.png', 'wb').write(r.content)
