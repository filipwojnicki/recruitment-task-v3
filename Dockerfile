FROM nginx:1.23-alpine As nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

FROM node:16.16-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

USER node

