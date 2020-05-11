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

---

## run an application

    gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app

---

## to do


-  services.py in kubernetes 
    - screenshot application is crashing, lack of memory resources?  https://stackoverflow.com/questions/53902507/unknown-error-session-deleted-because-of-page-crash-from-unknown-error-cannot/53970825

- test then check.py    

- frontend , check if can expose first

- check, this will likely be better in Go , because of concurency needs maybe checkout concurent futures # https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor-example
- tests per application endpoint
- use alpine image for screenshot application
- use alpine for compare application
