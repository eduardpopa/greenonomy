FROM alpine
LABEL stage="local"
WORKDIR /usr/local/app
COPY ./dist ./dist