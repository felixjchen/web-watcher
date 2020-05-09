# web-watcher

## run an application

    gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app

## to do

- configuration
- change listening production ports, service target ports
- scheduled check
- frontend

- fix COS endpoints
- consider rename compare_image application
- tests per application endpoint

- use alpine image for Selenium application
- use alpine for compare_image Sci kit application
