import requests

url = 'http://0.0.0.0:8001'
files = {'file': open('required/cos.png', 'rb')}

# upload
r = requests.post(f'{url}/files', files=files)

# download
r = requests.get(f'{url}/files/cos.png')
open('files/cos_down.png', 'wb').write(r.content)

requests.delete(f'{url}/files/cos.png')