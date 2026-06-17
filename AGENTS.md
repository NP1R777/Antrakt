# AGENTS.md

## Cursor Cloud specific instructions

This repo is the **Antrakt** theater website: a Django (DRF + SimpleJWT) backend with a
PostgreSQL database and MinIO/S3 image storage, plus a React (Create React App + TypeScript +
Chakra UI) frontend.

Layout:
- `backend/app` — Django project (`manage.py`, settings in `app/`, app code in `my_app1/`).
- `frontend/antrakt` — CRA frontend.
- `backend/database/init.sql` — PostgreSQL dump used to seed the dev DB (schema + data).

### Services (none auto-start; the update script only refreshes dependencies)

Start each in its own tmux session. PostgreSQL and MinIO binaries and the Python venv /
node_modules are already present from the VM snapshot.

1. **PostgreSQL** (port 5432) — start the cluster before the backend:
   `sudo pg_ctlcluster 16 main start`
   DB `antrakt`, user `postgres`, password `123` (matches `backend/app/app/settings.py` defaults).
   The dump is already loaded into the snapshot; only reload it if the DB is missing:
   `sudo -u postgres psql -d antrakt -f backend/database/init.sql`
2. **MinIO** (S3 storage, ports 9000/9001) — start before the backend so the `antrakt-images`
   bucket auto-creates on Django startup. The root password **must** be `minioadmin123` (the
   backend's `MINIO_SECRET_KEY` default). Inline env vars do NOT propagate through
   `tmux new-session`, so pass them via `env`:
   `tmux ... new-session -d -s minio -- env MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin123 minio server /home/ubuntu/minio-data --console-address ":9001"`
3. **Backend** (port 8000): from `backend/app`, run `../venv/bin/python manage.py runserver 0.0.0.0:8000`.
4. **Frontend** (port 3000): from `frontend/antrakt`, run `BROWSER=none npm start`.
   `apiClient.ts`/`AuthService.ts` hardcode the backend at `http://127.0.0.1:8000` / `http://localhost:8000`.

### Known dev admin login

`admin@antrakt.com` / `antrakt2026` (superuser; created during setup). The existing dumped
superuser `np1r777@admin.com` has an unknown password.

### Non-obvious gotchas

- **Do NOT apply migration `0002`** (`manage.py migrate` fails on it). The dump's source DB ran
  without it, and the seed data has duplicate `phone_number` values that violate the unique
  index `0002` adds. `runserver` only prints an "unapplied migration" warning and works fine.
- The dump schema has `user.phone_number` as **NOT NULL**, so any user you create directly must
  set a (unique) `phone_number` even though the model marks it nullable.
- Loading the dump on PostgreSQL 16 prints one harmless error about `transaction_timeout`
  (a PG17-only setting); everything else restores cleanly.
- **Tests are effectively non-functional / pre-existing breakage** (do not treat as your
  regression): `src/utils/stringMatching.test.ts` is a manual console demo with no `test()`
  blocks, and CRA's boilerplate `App.test.js` fails with `Cannot find module
  '@chakra-ui/utils/context'` (Chakra UI v2 + Jest resolver issue). The Django app defines no tests.

### Lint / typecheck

Frontend: `npx tsc --noEmit` (clean) and `npx eslint src --ext .js,.jsx,.ts,.tsx`
(0 errors, ~66 pre-existing warnings). There is no dedicated `lint` npm script; ESLint also runs
during `npm start`/`npm run build`.
