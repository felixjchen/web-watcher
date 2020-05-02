FROM python:3.7

RUN pip install --upgrade pip
RUN pip install ibm-cos-sdk
RUN pip install flask

COPY . .

CMD python cos.py