# FROM python:3.7-alpine
FROM python:3.7

RUN pip install --upgrade pip
RUN pip install aiohttp

RUN mkdir files
COPY services.py .

CMD services.py