FROM python:3.7-alpine

# For gevent
RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make

RUN pip install --upgrade pip
RUN pip install ibm-cos-sdk
RUN pip install flask
RUN pip install gevent
RUN pip install gunicorn

RUN mkdir files
COPY app.py .
COPY cos.py .

CMD gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:8001 \
    app:app