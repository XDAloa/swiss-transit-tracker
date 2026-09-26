# swiss-transit-tracker
Cloud-native transit route tracker built with Spring Boot 3, Angular 18, MongoDB, and Kubernetes (Helm).

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
