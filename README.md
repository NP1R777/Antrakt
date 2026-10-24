# Antrakt — Норильский народный театр

Django 5.2 / DRF / PostgreSQL 17 / MinIO, React 18 / TypeScript / Chakra UI.
Контейнеры используют Python 3.11 и Node 24.19.0. Локальный Node указан в
`frontend/antrakt/.nvmrc`. Для контейнеров нужен Docker с Compose v2 и BuildKit.

## Разработка

Из корня репозитория:

```sh
docker compose up -d --build --wait
docker compose exec backend python manage.py seed_demo
docker compose exec backend python manage.py createsuperuser
```

Frontend: порт 3000, API: 8000, MinIO S3: 9000, консоль MinIO: 9001. Порты доступны
только локально. Для конфликта с другими службами задайте `DEV_WEB_PORT`,
`DEV_API_PORT`, `DEV_DB_PORT`, `DEV_S3_PORT`, `DEV_S3_CONSOLE_PORT` перед запуском.
Адреса API/медиа для браузера изменятся согласованно. Эти dev-пароли нельзя
использовать в production.

Backend ждёт PostgreSQL, применяет миграции и собирает статику. В пустой базе
создаётся схема миграциями, без импорта SQL. `seed_demo` добавляет вымышленные
данные повторяемо и не создаёт рабочего пароля администратора. Исходники backend,
frontend/src и frontend/public смонтированы для автоматической перезагрузки;
после изменения зависимостей пересоберите соответствующий образ.

```sh
docker compose logs -f backend frontend
docker compose exec backend python manage.py test my_app1 --noinput
docker compose exec frontend npx tsc --noEmit
docker compose exec frontend npm run build
docker compose down
```

Обычный `down` сохраняет тома. Не используйте `down -v` для ценных данных.
PostgreSQL использует прежний project-scoped том `postgres_data`. MinIO теперь
тоже изолирован именем проекта, без глобального `container_name` и `name: minio_data`.
**Если раньше использовался глобальный dev-том `minio_data`, сначала подключите его явно:**

```sh
LEGACY_MINIO_VOLUME=minio_data docker compose -f docker-compose.yml -f docker-compose.legacy-minio.yml up -d --build --wait
```

Override объявляет существующий том external и не создаёт новый вместо него.
Сохраняйте то же имя Compose-проекта при работе со старой базой. Production-тома
и их имена этим изменением не переименовываются и не удаляются.

## Сборка за доверенным корпоративным/cloud-прокси

TLS-проверка всегда включена. Dockerfile поддерживают необязательный BuildKit
secret `build_ca` с доверенным PEM bundle. Он используется только при установке
зависимостей и не копируется в итоговый образ. Пример для отдельной сборки:

```sh
docker build --secret id=build_ca,src=/path/to/trusted-ca-bundle.pem -f backend/Dockerfile -t antrakt-backend-dev backend
```

Для Compose создайте `docker-compose.ca.local.yml`:

```yaml
services:
  backend:
    build:
      secrets: [build_ca]
  frontend:
    build:
      secrets: [build_ca]
secrets:
  build_ca:
    file: ${BUILD_CA_FILE:?Set the trusted CA bundle path}
```

Запуск: `BUILD_CA_FILE=/path/to/trusted-ca-bundle.pem docker compose -f docker-compose.yml -f docker-compose.ca.local.yml up -d --build --wait`.
Для production добавьте в этот override аналогичный build.secrets у promote-worker
и используйте основной docker-compose.prod.yml вместе с --env-file .env.prod.
Без прокси/дополнительного CA никаких настроек не нужно.
Нельзя заменять это отключением TLS или `--trusted-host`.

## Проверки и данные

- Backend-тесты находятся в `backend/app/my_app1`, используют отдельную тестовую БД.
- Целевые Jest-тесты: `AuthService.test.ts`, `ImageService.test.ts`,
  `ResetPasswordPage.test.tsx`, `PerformanceCredits.test.tsx`.
- Полный старый Jest-набор всё ещё содержит две известные неисправные suites:
  пустой `stringMatching.test.ts` и boilerplate `App.test.js` с Chakra/Jest resolver.
- Сведения о SQL, backup, Pillow и приватности: [DATA_AND_IMAGES.md](DATA_AND_IMAGES.md).
- Права API и восстановление пароля: [API_ACCESS.md](API_ACCESS.md).
- Поэтапный перенос связей: [PERFORMANCE_RELATIONS.md](PERFORMANCE_RELATIONS.md).
  `PERFORMANCE_RELATIONS_ENABLED=False` по умолчанию; сам запуск контейнеров перенос не выполняет.
- Production-запуск: [DEPLOYMENT.md](DEPLOYMENT.md).

## Ограничения проверки в облачной среде

Образы MinIO указанной версии недоступны из этой среды: Docker Hub отвечает access denied, Quay — unauthorized. Версия хранилища не менялась. Пока доступ к реестру
не восстановлен, полный стек и реальное S3-поведение здесь не подтверждены.
PostgreSQL/API/frontend проверяются отдельно в изолированном Docker-проекте с
`USE_MINIO_STORAGE=False`. Это тестовый override, а не замена MinIO в основном Compose.
