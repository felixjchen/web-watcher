import requests


url = 'http://0.0.0.0:8002'
files = {
    'file_old': open('required/compare_1.png', 'rb'),
    'file_new': open('required/compare_2.png', 'rb')
}

r = requests.get(f'{url}/difference', files=files)
print(r.text)


files = {
    'file_old': open('required/compare_1.png', 'rb'),
    'file_new': open('required/compare_2.png', 'rb')
}
r = requests.get(f'{url}/difference_image', files=files)
open('files/difference_1.png', 'wb').write(r.content)
