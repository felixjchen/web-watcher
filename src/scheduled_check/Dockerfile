FROM python:3.7-alpine

RUN pip install --upgrade pip
RUN pip install requests

RUN mkdir files
COPY scheduled_check.py . 

CMD python scheduled_check.py