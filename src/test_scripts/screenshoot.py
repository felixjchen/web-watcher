import requests

url = 'http://127.0.0.1:8002'
payload = {
    'url': 'http://www.facebook.com',
    'file_ID':  '10030303044.png'
}

r = requests.post(f'{url}/screenshot', json=payload)
open('10030303044.png', 'wb').write(r.content)
