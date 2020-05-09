FROM python:3.7-alpine

# RUN pip install --upgrade pip
# RUN pip install cloudant
# RUN pip install flask
# RUN pip install gevent
# RUN pip install gunicorn

RUN mkdir files
COPY services_async.py .

CMD services_async.py