FROM python:3.7-alpine

RUN pip install --upgrade pip
RUN pip install scikit-image
RUN pip install opencv-python
RUN pip install flask
RUN pip install gevent
RUN pip install gunicorn

RUN mkdir files
COPY app.py .
COPY image_compare.py .
COPY patched.py .

CMD gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app