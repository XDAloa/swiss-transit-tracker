# swiss-transit-tracker
Cloud-native transit route tracker built with Spring Boot 3, Angular 18, MongoDB, and Kubernetes (Helm).

## Voraussetzungen

- Java 21
- Maven 3.9+
- Node.js 20+ und npm
- Docker Desktop (optional, für MongoDB bzw. den vollständigen Stack)

## Lokale Entwicklung

### Backend

Das Backend läuft auf Port `8080`. MongoDB wird für Favoriten benötigt und kann lokal
über Docker gestartet werden:

```bash
docker compose up -d mongodb
cd backend
mvn clean compile
mvn spring-boot:run
```

Die Anwendung startet auch ohne erreichbare MongoDB. Transit-Abfragen verwenden die
öffentliche API von `https://transport.opendata.ch/v1`; Favoriten benötigen eine
laufende MongoDB auf `localhost:27017`.

### Frontend

Das Angular-Frontend läuft auf Port `4200`. Der Development-Server leitet alle
Anfragen unter `/api` über `frontend/proxy.conf.json` an das Backend weiter:

```bash
cd frontend
npm ci
npm start
```

Danach ist die Benutzeroberfläche unter <http://localhost:4200> erreichbar.

### Tests und Build

```bash
cd frontend
npm test
npm run build

cd ../backend
mvn clean compile
```

Der Frontend-Test läuft standardmäßig einmalig mit ChromeHeadless. Für den
interaktiven Watch-Modus kann `npm run test:watch` verwendet werden.

## API

Das Backend stellt folgende Endpunkte unter `http://localhost:8080/api` bereit:

| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| GET | `/stations?query=Zürich` | Bahnhöfe suchen |
| GET | `/connections?from=Zürich%20HB&to=Bern` | Verbindungen suchen |
| GET | `/favorites` | Favoriten abrufen |
| POST | `/favorites` | Route als Favorit speichern |
| GET | `/favorites/{id}` | Einen Favoriten abrufen |
| PUT | `/favorites/{id}` | Einen Favoriten ändern |
| DELETE | `/favorites/{id}` | Einen Favoriten löschen |

Ein Favorit verwendet dieses JSON-Format:

```json
{
  "fromStation": "Zürich HB",
  "toStation": "Bern"
}
```

## Docker Compose

Der vollständige Stack startet mit:

```bash
docker compose up --build
```

MongoDB läuft auf Port `27017`, das Backend auf `8080` und das produktive
Frontend über Nginx auf Port `80`.

## Branching & Release Strategy

- **main**: Production-Branch. Releases erfolgen über Git-Tags nach SemVer (`v*.*.*`) und triggern den Build/Push in die Registry.
- **int**: Integrations-Branch für konsolidierte Änderungen und Pre-Release-Tests vor dem Merge nach `main`.
- **feature/\***: Kurzlebige Feature-Branches mit PR-basierter Entwicklung gegen `int` (oder bei Bedarf direkt gegen `main`).

### GitHub Branch Protection (empfohlen)

- **Require a pull request before merging** für `main` und `int`
- **Require status checks to pass before merging** mit mindestens `validate-and-test`

### `int`-Branch initial anlegen

```bash
./scripts/init-int-branch.sh
```
