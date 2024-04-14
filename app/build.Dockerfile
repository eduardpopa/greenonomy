# FROM oven/bun:1.0.20-alpine
FROM node:20-alpine 
WORKDIR /usr/local/app
 COPY package.json tsconfig.json tsconfig.app.json angular.json  ./
 COPY ./src ./src
 RUN export NODE_OPTIONS="--max-old-space-size=8192"
# RUN bun install
# RUN bun run build
RUN npm install
RUN npm run build
