# swap.io-networks-app

https://networks.swap.io

This is a repository for a web based explorer of network, token, and coin definitions in the [swap.io-networks](https://github.com/swaponline/swap.io-networks) repo.

# Get started

## Install

### 1. Install docker

See https://docs.docker.com/engine/install/

### 2. Install docker-compose

See https://docs.docker.com/compose/install/

### 3. Clone and run the repo

```
git clone https://github.com/swaponline/swap.io-networks-app.git
cd swap.io-networks-app
git submodule init
git submodule update
echo "PORT=8197" > .env
docker-compose up -d
```

This should install and start up the local copy of swap.io-networks repo explorer.

To access the frontend browse to

```
http://localhost:8197/
```
