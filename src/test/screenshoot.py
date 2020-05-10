import requests

url = 'http://0.0.0.0:8003'
payload = {
    'url': 'http://www.facebook.com',
}

r = requests.get(f'{url}/screenshot', json=payload)
open('files/screenshot.png', 'wb').write(r.content)
