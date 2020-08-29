FROM node:14.2

COPY package.json .
COPY app.js .
COPY handlers.js .
RUN npm install

CMD node app.js