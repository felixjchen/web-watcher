FROM node:14.2
 
ADD views ./views
COPY package.json .
COPY app.js .
RUN npm install

CMD node app.js