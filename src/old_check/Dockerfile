FROM python:3.7-alpine

RUN pip install --upgrade pip
RUN pip install requests

RUN mkdir files
COPY helpers.py . 
COPY check.py . 

CMD python check.py