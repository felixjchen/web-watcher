# web-watcher

## run an application

    gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app

## to do

- use alpine image for Selenium application
