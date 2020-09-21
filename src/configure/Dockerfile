FROM python:3.7-alpine

# For gevent
RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make
RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN mkdir files/
COPY app.py .
COPY configure.py .

CMD gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:8004 \
    app:app