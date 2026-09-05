# Pragati Intern Local Setup

This branch (`copy-for-interns`) is a developer-friendly copy of Pragati intended for local feature development and testing. It uses Docker for PostgreSQL, Redis, and the Firebase Auth/Firestore emulators, so interns do not need production credentials or separate cloud projects.

## What an intern needs

Install only:

- Git
- Node.js 18+
- Docker Desktop
- VS Code (recommended)

No personal Firebase project, Firebase service-account JSON, production database, production Redis, Resend account, or Daily account is required for ordinary local development.

## 1. Clone the repository

```bash
git clone https://github.com/Ayush-Kant/Pragati-student-module.git
cd Pragati-student-module
```

The repository can be public or private. If it is public, no GitHub collaborator access is needed merely to clone it.

## 2. Start from the intern setup branch

```bash
git fetch origin
git switch copy-for-interns
```

Feature work should not be done on `copy-for-interns`. Create a task branch from it:

```bash
git switch -c feature/<your-name>-<feature-name>
```

Example:

```bash
git switch -c feature/rahul-training-page
```

## 3. Run the one-time setup

From the repository root:

```bash
npm run setup:dev
```

This command:

1. Verifies Node.js and Docker Compose.
2. Creates or repairs the local `backend/.env` infrastructure settings.
3. Creates or repairs the ignored `frontend/.env.local` Firebase emulator settings.
4. Checks that Pragati's dedicated local ports are available.
5. Starts PostgreSQL, Redis, and Firebase emulators through Docker Compose.
6. Waits for PostgreSQL, Redis, Firebase Auth, Firestore, and the Firebase UI to become reachable.
7. Installs backend dependencies.
8. Installs frontend dependencies.
9. Authenticates against PostgreSQL using the exact connection the backend will use.
10. Runs the backend database migrations.

The command does not copy or use production credentials.

## 4. Local service ports

Pragati deliberately uses dedicated high host ports so an intern can keep an existing PostgreSQL or Redis installation running. The container ports remain the normal service ports.

```text
Frontend:          http://localhost:5173
Backend:           http://localhost:5000
PostgreSQL:        127.0.0.1:55432 -> container 5432
Redis:             127.0.0.1:56379 -> container 6379
Firebase Emulator: http://localhost:54000
Auth Emulator:     http://localhost:59099
Firestore:         http://localhost:58080
```

PostgreSQL clients such as pgAdmin should use:

```text
Host:     127.0.0.1
Port:     55432
Database: pragati_dev
Username: postgres
Password: postgres
```

Do not use port `5432` for this Docker database. Port `5432` may belong to a developer's native PostgreSQL installation.

## 5. Start the application

From the repository root:

```bash
npm run dev
```

This starts the existing backend and frontend dev servers.

Open the frontend at `http://localhost:5173`.

## 6. Local student authentication

The backend is configured to use the Firebase Auth emulator when `FIREBASE_AUTH_EMULATOR_HOST` is present. The frontend setup also points Firebase Auth at the same local emulator. Student registration therefore uses the same application authentication flow, but the account is created only in the local emulator.

Register a student through the application using a development email address and a password that meets the application's student password rules.

Local emulator data is isolated to the developer's Docker environment and is not sent to the production Firebase project.

## 7. Local Firestore

When `FIRESTORE_EMULATOR_HOST` is set, Firestore requests are routed to the local emulator. The repository includes permissive rules specifically for emulator-only development.

Never copy these rules to production.

## 8. Local PostgreSQL workflow

The backend uses PostgreSQL. The Docker database is disposable local development data.

To inspect tables:

```bash
docker compose exec postgres psql -U postgres -d pragati_dev
```

Then inside `psql`:

```sql
\dt
```

To rerun the full migration set:

```bash
npm --prefix backend run migrate
```

The migration command starts by dropping the current public tables/types, so only use it against the disposable local database.

## 9. Optional existing seed scripts

The backend already contains project-specific seed scripts. Use them only when you need their particular fixture data.

Examples:

```bash
npm --prefix backend run seed:student-demo
npm --prefix backend run seed:student-college
npm --prefix backend run seed:student-interviews
npm --prefix backend run seed:student-notifications
```

Some existing seed scripts are intentionally broad or destructive, so do not run `backend/scripts/seed.js` against anything other than your disposable local database.

## 10. Daily Git workflow

Start a new task from the latest branch supplied by the team:

```bash
git fetch origin
git switch copy-for-interns
git pull --ff-only origin copy-for-interns
git switch -c feature/<your-name>-<feature>
```

Before pushing:

```bash
git status
git diff
npm run lint
npm run build
npm run test:backend
```

Then:

```bash
git add .
git commit -m "feat: describe the change"
git push -u origin feature/<your-branch>
```

Open a Pull Request with:

```text
base: develop
compare: feature/<your-name>-<feature>
```

Do not push directly to `main` or `develop` unless the project owner explicitly instructs you to.

## 11. Keeping a feature branch current

```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch feature/<your-branch>
git merge develop
```

Resolve any conflicts, retest the feature, and then push.

## 12. ChatGPT / Codex

Use your own GitHub account and your own ChatGPT/Codex account. Connect GitHub from ChatGPT's Settings → Apps → GitHub, then select the repository when it becomes available.

When asking an AI coding assistant to work on the repository, tell it the exact branch first, for example:

```text
I am working in Pragati-student-module.
My current branch is feature/rahul-training-page.
Read the existing implementation before making changes.
Do not modify unrelated functionality.
Implement the requested task on my branch and explain how to test it locally.
```

Always review AI-generated changes locally with `git diff`, then run the relevant tests/build before pushing.

## 13. Stop the local environment

Stop the development servers with `Ctrl+C`.

Stop Docker services with:

```bash
docker compose down
```

This stops containers but keeps named volumes, so local PostgreSQL/Redis data remains.

To completely reset local data:

```bash
docker compose down -v
```

The `-v` option deletes only this Compose project's local PostgreSQL, Redis, and Firebase emulator cache volumes. Use it when you intentionally want a clean local environment.

## 14. Troubleshooting

### Docker is not running

Open Docker Desktop and retry:

```bash
npm run setup:dev
```

### PostgreSQL port 5432 is already in use

This is expected on many developer machines. Pragati's Docker PostgreSQL does **not** use host port 5432 anymore. It uses:

```text
127.0.0.1:55432 -> PostgreSQL container:5432
```

Your existing PostgreSQL service on `5432` can remain running.

### Pragati's dedicated port is already in use

The setup script checks these ports before starting Docker:

```text
55432  PostgreSQL
56379  Redis
54000  Firebase UI
58080  Firestore emulator
59099  Firebase Auth emulator
```

Close the application using the conflicting port and rerun:

```bash
npm run setup:dev
```

### PostgreSQL authentication error

Run:

```bash
npm --prefix backend run check:db
```

The command tests the same `POSTGRESQL_URI` used by the backend. If it reports that the local configuration is wrong, rerun `npm run setup:dev` from the repository root so the required local infrastructure settings in `backend/.env` are repaired.

### Firebase emulator is restarting or registration says ECONNREFUSED

Run:

```bash
docker compose ps
docker compose logs --tail=200 firebase
```

A healthy Firebase service should be `Up`, not `Restarting` or `Exited`. The setup script waits for the Firebase UI, Firestore emulator, and Auth emulator ports before completing, so a fresh setup should stop here with a diagnostic error instead of reporting a false success.

### Need a completely clean local database

Run:

```bash
docker compose down -v
docker compose up -d postgres redis firebase
npm run setup:dev
```

### Firebase credential error

For local development the backend should contain:

```env
FIREBASE_PROJECT_ID=pragati-local
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:59099
FIRESTORE_EMULATOR_HOST=127.0.0.1:58080
```

The setup also creates an ignored `frontend/.env.local` that points the browser's Firebase Auth SDK to `127.0.0.1:59099`.

Do not add a production service-account key just to make local development work.

## 15. Important security rules

Never commit:

- `backend/.env`
- Firebase service-account JSON
- API keys
- JWT secrets used outside local development
- production database credentials
- production Firebase credentials
- production Redis credentials

The repository's `.gitignore` already ignores backend `.env` and Firebase service-account JSON patterns.

## 16. Expected result

After setup, an intern should be able to work locally using:

```text
Git + Node.js + Docker Desktop
```

with this local stack:

```text
Browser
  │
  ▼
Vite / React :5173
  │
  ▼
Express API :5000
  │
  ├── PostgreSQL host :55432 → container :5432
  ├── Redis host :56379 → container :6379
  └── Firebase Auth host :59099 → container :9099
       Firestore host :58080 → container :8080
```

No production Firebase Auth project is required for the basic local student registration workflow.
