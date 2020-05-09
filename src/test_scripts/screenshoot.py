import requests

url = 'http://0.0.0.0:80'
payload = {
    'url': 'http://www.facebook.com',
}

r = requests.post(f'{url}/screenshot', json=payload)
open('10030303044.png', 'wb').write(r.content)
