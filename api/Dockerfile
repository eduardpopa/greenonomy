FROM oven/bun:latest
WORKDIR /usr/local/api
COPY . /usr/local/api
RUN bun install
USER bun
ENTRYPOINT [ "bun", "run", "index.ts" ]
