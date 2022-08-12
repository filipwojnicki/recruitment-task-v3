## Description

## Installation

Clone git repository

Place the database file in the correct directory or copy the sample file

```bash
$ cp data-microservice/data/db-example.json data-microservice/data/db.json
```

Create or copy example .env file

```bash
$ cp .env-example .env
```

## Running the app

Run application in development mode using docker

```bash
$ docker-compose  -f docker-compose.yml -f docker-compose-development.yml up --build -V
```
