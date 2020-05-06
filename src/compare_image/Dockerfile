FROM python:3.7

# #
# # For gevent
# RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make 

RUN pip install --upgrade pip
RUN pip install numpy
RUN pip install scikit-image
RUN pip install opencv-python
RUN pip install flask
RUN pip install gevent
RUN pip install gunicorn

RUN mkdir files
COPY app.py .
COPY compare_image.py .
COPY patched.py .

CMD gunicorn --worker-class gevent \
    --workers 2 \
    --bind 0.0.0.0:80 \
    patched:app