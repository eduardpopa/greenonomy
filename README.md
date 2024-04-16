# Greenonomy: dApp in practice

The solution stack defined in `./docker-compose.yml` is composed by the following components:

- ## [ganaghe] (https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/)

  Local Ethereum blockchain environment used to store smart contracts and transactions

  1. expose port:`8545` for localhost

> Shared `ganache` VOLUME used to save accounts

- ## [truffle] (https://archive.trufflesuite.com/)

  Development framework for Ethereum-based blockchain projects

  1. compile test and deploy `/truffle/contracts`

> Shared `truffle` VOLUME used to save build contracts and link them with APP `./app/src/contracts`

- ## [NGINX](https://hub.docker.com/_/nginx)

  Web server configured by [`./nginx/nginx.conf`](./nginx/nginx.conf) will do the following:

  1. Listen on port :80 and serve static content from `/usr/share/nginx/html/app`
  2. Redirect all requests (\*except 4.) to `/index.html` **/** is important because the static content is an [SPA] with own routing mechanism.
  3. Proxy the requests under `/api` location to API web service `http://api:81`
  4. Set CORS headers
     > { Access-Control-Allow-Origin \* } used for local development outside of docker

> Shared `app` VOLUME is used to link the output from the APP `/usr/local/app/dist/app/browser` to NGINX `/usr/share/nginx/html/app`

- ## [APP](./app/)

  Is an Single Page Application developed with [Angular@17](https://angular.io/guide/releases) and [Angular Material@17](https://material.angular.io)+[web3js](https://web3js.org/)

  > There are two options in `./docker-compose.yml` file to use the APP:

  - `./app/build.Dockerfile` image to build the application from sources
  - `./app/local.Dockerfile` image that contains an existing pre-build application **default** since build is taking ~2 min.

- ## [API](./api/)

  REST web services using [BUN](https://bun.sh) with typescrypt and express.

  > \*( **ID** removed from the JSON model saved to REDIS - already it is used as KEY)

- ## REDIS

  Image from `redis/redis-stack-server:latest` with installed [RedisJSON](https://github.com/RedisJSON/RedisJSON) module [(**v7 redis:latest**) ships without modules]

  > It is using `./redis/data` local VOLUME to backup every 10s `- REDIS_ARGS= --save 10 1 --appendonly yes`

## Start the application

- `$ docker compose up -d`
- [http://localhost:8080](http://localhost:8080)
- - contracts are not linked [yet] to app build (fix):
    - `$ cd truffle` and run `$ truffle migrate`
    - copy Greenom, Item, Market addresses (0xb105d96170dbb99bc2F7B75Df007Ebe9a8121cB5) from output terminal to `/app/src/enivironemnt/environemnt.ts` coresponding variables
    - copy `/truffle/build/` Item.json, Greenom.json, Market.json to `/app/src/contracts` folder
    - run `$ ng serve`
    - [http://localhost:4200](http://localhost:4200)
- `$docker system prune -a`
