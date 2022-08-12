## Description

PL

Zamysłem związanym z tworzeniem tego projektu było odrazu wpięcie go w architekturę systemu rozproszonego za czym przemawia głównie skalowalność rozwiązania.
Użyłem do tego czegoś w rodzaju microservice'u ( w zamyśle tylko jedna instancja ), która jest jedynie odpowiedzialna za synchronizacje data store (Redis) z plikiem bazy danych. Rest API jest wystawione w głównym komponencie i je w zamyśle możemy skalować. Oba serwisy mają wyczyszczona pamięć jeśli chodzi o przechowywanie w niej zawartości pliku. Zawartość pliku ląduje w Redis, który pełni rolę centrum komunikacji pomiędzy serwisami ( message broker) jak i pamięci współdzielonej ( shared memory ) przez co oba serwisy korzystają ze wspólnej pamięci a jednocześnie nie są nią obciążone. Redis w tym rozwiązaniu poprawia wydajność i umożliwia skalowanie. O każdej zmianie przez API jest informowany data service ( eventem ) i wtedy ściąga on pamięć do pliku. Dane z pliku ładowane są w postaci schematów jsona do Redisa gdzie są obsługiwane ( przez moduły Redis json i Redis Search ) i cachowane. Redisa moglibyśmy zastąpić baza danych która operuje na plikach a nie na pamięci. Nad integralnością danych w data store czuwa redis-om.
Poprawy wymaga napewno powtarzenie definicji schematów i interface'ów pomiędzy serwisami(pomogło by tu być może wydzielenie kolejnego microservice'u). Należy się także przyjrzeć kolejce w data-microservice, która dodaje każde dodanie obiektu jako kolejne zapisanie pliku. Należałoby to ograniczyć.

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

Run application in development mode using docker compose

```bash
$ docker-compose  -f docker-compose.yml -f docker-compose-development.yml up --build -V
```
