# web-watcher

## Applications

### cloud_object_storage

- https://0.0.0.0:8001
- uploads and downloads files from IBM Cloud Cloud Object Storage

### compare

- https://0.0.0.0:8002
- find difference between two images

### screenshot

- https://0.0.0.0:8003
- uses Selenium to screenshot at an url

### configure

- https://0.0.0.0:8004
- reads and writes configuration to IBM Cloud Cloudant NoSQL

## Jobs

### check

- threaded for each watcher
- if last_run + frequency < current epoch then check if the web page has changed, notify user if it has

---

## run an application

    gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app

---

## to do

- frontend: https://material.io/develop/web/docs/getting-started/
- check, this will likely be better in Go , because of concurency needs maybe checkout concurent futures # https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor-example
- tests per application endpoint
- use alpine image for screenshot application
- use alpine for compare application
