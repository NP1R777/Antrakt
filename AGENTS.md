# AGENTS.md

## Project and workflow

Antrakt is a Django/DRF + PostgreSQL 17 + MinIO backend and React/TypeScript/Chakra frontend.
Use the existing checkout; do not create a worktree unless the user asks for one.
See README.md for tested dev commands and DEPLOYMENT.md for production.

- backend/app: manage.py, app.settings, my_app1 models/views/serializers/tests.
- frontend/antrakt: CRA frontend, Node 24.19.0 (.nvmrc).
- Docker Python target is 3.11 in both backend Dockerfiles.
- Production runs gunicorn + nginx + Caddy; development uses Django runserver and npm start.
- Startup entrypoint waits for DB, migrates, collects static. Worker waits for healthy backend.

## Running and checking

From repository root: docker compose up -d --build --wait. Default host ports:
3000 frontend, 8000 API, 5432 PostgreSQL, 9000/9001 MinIO. DEV_*_PORT variables can override them.
Backend health endpoint is /health/. Django reads DATABASE_HOST/PORT/NAME/USER/PASSWORD,
not DATABASE_URL. Inside containers the DB host is db, MinIO endpoint is http://minio:9000;
frontend API and media addresses are browser-facing localhost addresses.

Use a distinct -p project and free host ports for isolated tests. Never attach or clear
existing volumes for a smoke test. Existing global dev MinIO storage requires the explicit
docker-compose.legacy-minio.yml override; see README.md. Do not change the storage version
or production project/volume names implicitly. Never run down -v on user data.

Backend: python manage.py test my_app1 --noinput from backend/app (Docker: /app).
Public production HTML passes through nginx → backend /public-page/ → frontend /index.html.
The exact /index.html location must stay static to prevent a proxy loop.
PUBLIC_SPA_INDEX_URL is configured in production Compose; see LINK_PREVIEWS.md.

Frontend: npx tsc --noEmit and npm run build from frontend/antrakt.
Backend tests are substantial and functional. The old frontend App.test.js and
stringMatching.test.ts have known pre-existing failures; run relevant targeted suites and
report their results distinctly. Do not disable checks to make them pass.

Cloud Docker builds may need the environment-provided trusted CA via optional BuildKit
secret build_ca. Never disable TLS. Cloud MinIO pulls currently return access denied /
unauthorized; report S3 integration as unverified until access works.

## Data preservation

Both tracked init.sql files are sanitized schema + migration metadata, with no users or sessions.
Fresh dev databases should use migrations and seed_demo, not historical SQL. Demo users have
unusable passwords. Create an administrator locally with createsuperuser; no credentials are bundled.
Never restore SQL over a populated database, print secret values or commit private backups/reports.
Keep production values in .env.prod. The tracked .env.prod.example contains empty secret placeholders.

PERFORMANCE_RELATIONS_ENABLED is disabled by default. Migration 0026 only creates a ledger;
link_legacy_performances analyzes unless --apply and a reviewed --expected-digest are supplied.
Production import needs separately authorized backup restoration and review. See PERFORMANCE_RELATIONS.md.

## Product backlog

The performance admin form must retain its established appearance and workflow.
Its internal components live in frontend/antrakt/src/pages/admin/forms/performance;
do not redesign it without explicit user approval.

The owner expects autonomous routine operation. Administrators primarily publish
performances, news and photos; do not introduce mandatory review queues or recurring
manual maintenance into ordinary site operation. Preserve automatic performance
promotion and other existing automation. VK reviews should publish automatically;
ordinary imports inspect the latest 20 wall posts, without revisiting tracked old posts.

Agreed follow-up work is in BACKLOG.md. When implementing it, update the appropriate statuses.
Do not mark staged work done while production transfer or ambiguous-record review is outstanding.
Do not commit or push unless authorized by the user.
