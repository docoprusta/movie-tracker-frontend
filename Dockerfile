FROM node:9.3-alpine

COPY . /opt/movie-tracker

WORKDIR /opt/movie-tracker

RUN npm install

CMD npm start