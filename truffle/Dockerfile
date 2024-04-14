FROM node:18-bullseye-slim 
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global truffle 
RUN truffle --version

RUN mkdir -p /usr/local/truffle
WORKDIR /usr/local/truffle

COPY package.json /
COPY package-lock.json /usr/local/truffle

RUN npm install 

COPY ./truffle-config.js ./truffle-config.js 
COPY ./contracts ./contracts
COPY ./migrations ./migrations
COPY ./test ./test
COPY ./deploy.sh ./deploy.sh
RUN chmod +x /usr/local/truffle/deploy.sh
# RUN truffle migrate -- network docker
# RUN truffle test --network docker

# ENTRYPOINT [ "truffle","migrate --network docker" ]

ENTRYPOINT ["/usr/local/truffle/deploy.sh"]


