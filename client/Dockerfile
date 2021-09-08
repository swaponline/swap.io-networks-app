# build stage
ARG NODE_VERSION=14.7.0
FROM node:${NODE_VERSION} AS build-stage
#ENV NODE_ENV production
RUN mkdir -p /app
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build
# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
