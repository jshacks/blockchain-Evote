# Database

## Install

```bash
# Arch
sudo pacman -S mongodb

# Debian
sudo apt install mongodb
```

## Run

```bash
# Locally
mongod --dbpath=./database/data
```

On a debian server it's started by default.

PORT: 27017
Data: /var/lib/mongodb

## Check

```bash
node ./database/check_connection.js
```
