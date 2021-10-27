# build stage
ARG NODE_VERSION=14.7.0
FROM node:${NODE_VERSION} AS build-stage
#ENV NODE_ENV production
RUN mkdir -p /app
WORKDIR /app
COPY swap.io-networks ./networks
COPY package*.json ./
RUN npm install
COPY server .
EXPOSE 3001
