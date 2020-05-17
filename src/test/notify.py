import requests
import json
import os

url = 'http://0.0.0.0:8006'
files = {
         'file': open('required/cos.png', 'rb')
    }

values = {'url': 'https://stackoverflow.com/questions/12385179/how-to-send-a-multipart-form-data-with-requests-in-python',
 'email': 'felixchen1998@gmail.com'}

r = requests.post(f'{url}/notify', files=files, data=values)

print(r.text)