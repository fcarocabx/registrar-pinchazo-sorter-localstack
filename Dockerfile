######  DEV  #####
FROM node:20.11.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start:dev

######  PROD  #####
#FROM node:20.11.0-alpine AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#
#FROM node:20.11.0-alpine
#WORKDIR /app
#COPY --from=build /app/dist ./dist
#COPY package*.json ./
#RUN npm install --production
#CMD npm run start:prod