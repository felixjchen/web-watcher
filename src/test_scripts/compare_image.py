import requests


url = 'http://0.0.0.0:80'
files = {
    'file_old': open('files/old_1.png', 'rb'),
    'file_new': open('files/new_1.png', 'rb')
}

r = requests.post(f'{url}/difference', files=files)
print(r.text)


files = {
    'file_old': open('files/old_1.png', 'rb'),
    'file_new': open('files/new_1.png', 'rb')
}
r = requests.post(f'{url}/difference_image', files=files)
open('files/difference_1.png', 'wb').write(r.content)
