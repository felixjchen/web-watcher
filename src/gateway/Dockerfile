FROM node:14.2

COPY package.json .
RUN npm install

COPY globals.js .
COPY app.js .
COPY handlers.js .

CMD node app.js