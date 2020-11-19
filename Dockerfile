FROM node:alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN yarn install

COPY . .

CMD ["yarn", "run", "start"]