FROM python:3.7-alpine

# For gevent
RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN mkdir files/
COPY app.py .
COPY configure.py .

CMD gunicorn --worker-class gevent \
    --workers 1 \
    --bind 0.0.0.0:8004 \
    app:app