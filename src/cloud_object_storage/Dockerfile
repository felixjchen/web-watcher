FROM python:3.7-alpine

RUN pip install --upgrade pip
RUN pip install ibm-cos-sdk
RUN pip install flask

COPY app.py .
COPY cos.py .

CMD python app.py