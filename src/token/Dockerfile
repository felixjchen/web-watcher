FROM node:14.2

COPY package.json .
RUN npm install

COPY app.js .
COPY handlers.js .

CMD node app.js