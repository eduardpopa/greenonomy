# FROM oven/bun:1.0.20-alpine
# FROM node:20-alpine 
FROM node:18-bullseye-slim 
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*
WORKDIR /usr/local/app
COPY package.json package-lock.json tsconfig.json tsconfig.app.json angular.json  ./
COPY ./src ./src
ENV NODE_OPTIONS=--max_old_space_size=8192
# RUN export NODE_OPTIONS="--max-old-space-size=8192"
# RUN bun install
# RUN bun run build
RUN npm install
RUN npm run build
