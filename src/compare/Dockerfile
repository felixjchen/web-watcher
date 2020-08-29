FROM python:3.7

# # For gevent
# RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make 


RUN mkdir files
COPY requirements.txt . 
COPY app.py .
COPY compare.py .

RUN pip install -r requirements.txt

CMD gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:8002 \
    app:app