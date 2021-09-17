# swap.io-networks-app

https://networks.swap.io

This is a repository for a web based explorer of network, token, and coin definitions in the [swap.io-networks](https://github.com/swaponline/swap.io-networks) repo.

# Get started

## Install

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
