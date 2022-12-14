FROM node:12-alpine

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn install 

COPY . .

EXPOSE $PORT

CMD yarn run start:dev