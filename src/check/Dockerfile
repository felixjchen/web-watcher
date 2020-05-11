FROM python:3.7-alpine

RUN pip install --upgrade pip
RUN pip install requests

RUN mkdir new
RUN mkdir old
COPY check.py . 

CMD python check.py