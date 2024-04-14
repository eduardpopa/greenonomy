FROM node:18-bullseye-slim 
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global ganache-cli
WORKDIR /usr/local

ENTRYPOINT ["ganache-cli", "-h", "0.0.0.0", "--acctKeys","./data/accounts.txt"]