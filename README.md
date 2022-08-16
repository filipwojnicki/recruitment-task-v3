## Description

PL

Zamysłem związanym z tworzeniem tego projektu było odrazu wpięcie go w architekturę systemu rozproszonego za czym przemawia głównie skalowalność rozwiązania.
Użyłem do tego czegoś w rodzaju microservice'u ( w zamyśle tylko jedna instancja ), która jest jedynie odpowiedzialna za synchronizacje data store (Redis) z plikiem bazy danych. Rest API jest wystawione w głównym komponencie i je w zamyśle możemy skalować. Oba serwisy mają wyczyszczona pamięć jeśli chodzi o przechowywanie w niej zawartości pliku. Zawartość pliku ładowana jest do Redis, który pełni rolę centrum komunikacji pomiędzy serwisami ( message broker) jak i pamięci współdzielonej ( shared memory ) przez co oba serwisy korzystają ze wspólnej pamięci a jednocześnie nie są nią obciążone. Redis w tym rozwiązaniu poprawia wydajność i umożliwia skalowanie. O każdej zmianie przez API jest informowany data service ( eventem ) i wtedy ściąga on pamięć do pliku. Dane z pliku ładowane są w postaci schematów jsona do Redisa gdzie są obsługiwane ( przez moduły Redis json i Redis Search ) i cachowane. Redisa moglibyśmy zastąpić baza danych która operuje na plikach a nie na pamięci. Nad integralnością danych w data store czuwa redis-om.
Poprawy wymaga napewno powtarzenie definicji schematów i interface'ów pomiędzy serwisami(pomogło by tu być może wydzielenie kolejnego microservice'u). Należy się także przyjrzeć kolejce w data-microservice, która dodaje każde dodanie obiektu jako kolejne zapisanie pliku. Należałoby to ograniczyć.

EN

The idea behind creating this project was to immediately connect it to the architecture of a distributed system, which is mainly supported by the scalability of the solution.
For this I used something like a microservice (only one instance in mind), which is only responsible for synchronizing the data store (Redis) with the database file. Rest API is included in the main component and we can scale it. Both sites have cleared memory when it comes to storing the contents of the file in it.
The content of the file loads into Redis, which acts as a communication center between services (message broker) and shared memory, so that both services use common memory and are not overloaded with it. Redis in this solution improves performance and enables scaling. The data service (event) is informed about each change by the API, and then it downloads the memory to a file. The data from the file is loaded in the form of json schemas to Redis where they are handled (by Redis json and Redis Search modules) and cached. We could replace Redis with a database that works with files, not memory. The data integrity in the data store is supervised by redis. It is necessary to improve the definition of schemas and interfaces between services (it would be helpful to separate another microservice here). We should also look at the queue in data-microservice, which adds each object added as the next file save. This should be limited.

## Installation

Clone git repository

Place the database file in the correct directory or copy the sample file

```bash
$ cp data-microservice/data/db-example.json data-microservice/data/db.json
```

Create or copy example .env file, edit it if needed

```bash
$ cp .env-example .env
```

## Running the app

Run application in development mode using docker compose

```bash
$ docker-compose  -f docker-compose.yml -f docker-compose-development.yml up --build -V
```

## Documentation

After successful launch of the application, the api documentation (Open api) is available at the url

[Go to documentation](http://localhost/api/docs)
