FROM node:10

ENV NODE_ENV = production

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD node app.js

EXPOSE 3000		