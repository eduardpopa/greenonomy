# Exercise 4: BINFO-CEP alumni

The solution stack defined in `./docker-compose.yml` is composed by the following components:

- ## [NGINX](https://hub.docker.com/_/nginx)

  Web server configured by [`./nginx/nginx.conf`](./nginx/nginx.conf) will do the following:

  1. Listen on port :80 and serve static content from `/usr/share/nginx/html/app`
  2. Redirect all requests (\*except 4.) to `/index.html` **/** is important because the static content is an [SPA] with own routing mechanism.
  3. Proxy the requests under `/api` location to API web service `http://api:81`
  4. Set CORS headers
     > { Access-Control-Allow-Origin \* } used for local development outside of docker

> Shared `app` VOLUME is used to link the output from the APP `/usr/local/app/dist/app/browser` to NGINX `/usr/share/nginx/html/app`

- ## [APP](./app/)

  Is an Single Page Application developed with [Angular@17](https://angular.io/guide/releases) and [Angular Material@17](https://material.angular.io)

  > There are two options in `./docker-compose.yml` file to use the APP:

  - `./app/build.Dockerfile` image to build the application from sources
  - `./app/local.Dockerfile` image that contains an existing pre-build application **default** since build is taking ~2 min.

  > Since there is only one feature (`./app/src/app/alumni`) in the application, the angular router is set to serve everything from **/alumni** path `{ path: '**', redirectTo: 'alumni' },`

- ## [API](./api/)

  REST web services using [BUN](https://bun.sh) with typescrypt and express.

  > \*( **ID** removed from the JSON model saved to REDIS - already it is used as KEY)

- ## REDIS

  Image from `redis/redis-stack-server:latest` with installed [RedisJSON](https://github.com/RedisJSON/RedisJSON) module [(**v7 redis:latest**) ships without modules]

  > It is using `./redis/data` local VOLUME to backup every 10s `- REDIS_ARGS= --save 10 1 --appendonly yes`

## Start the application

- `$ docker compose up`
- [http://localhost:8080](http://localhost:8080)
- `$docker system prune -a`
