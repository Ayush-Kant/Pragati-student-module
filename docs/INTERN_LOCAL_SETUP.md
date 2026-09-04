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

Feature work should not be done on `copy-for-interns`. Create a task branch from it (or from the team's agreed integration branch):

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

1. Verifies Node.js and Docker.
2. Creates `backend/.env` from the safe `backend/.env.intern.example` if it does not already exist.
3. Starts PostgreSQL, Redis, and Firebase emulators through Docker Compose.
4. Waits for PostgreSQL to become ready.
5. Installs backend dependencies.
6. Installs frontend dependencies.
7. Runs the backend database migrations.

The command does not copy or use production credentials.

## 4. Start the application

From the repository root:

```bash
npm run dev
```

This starts the existing backend and frontend dev servers.

Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Firebase Emulator UI: http://localhost:4000
- Firebase Auth Emulator: http://localhost:9099
- Firestore Emulator: http://localhost:8080

PostgreSQL runs on `localhost:5432` and Redis on `localhost:6379`.

## 5. Local student authentication

The backend is configured to use the Firebase Auth emulator when `FIREBASE_AUTH_EMULATOR_HOST` is present. Student registration therefore uses the same backend authentication path as the application, but accounts are created only in the local emulator.

Register a student through the application using a development email address and a password that meets the application's student password rules.

Local emulator data is isolated to the developer's Docker environment and is not sent to the production Firebase project.

## 6. Local Firestore

When `FIRESTORE_EMULATOR_HOST` is set, Firestore requests are routed to the local emulator. The repository includes permissive rules specifically for emulator-only development.

Never copy these rules to production.

## 7. Local database

The local PostgreSQL container is:

```text
Host: localhost
Port: 5432
Database: pragati_dev
Username: postgres
Password: postgres
```

These credentials are intentionally local-development-only.

To rerun migrations:

```bash
npm run dev:backend
```

In another terminal, from `backend/`:

```bash
npm run migrate
```

## 8. Optional existing seed scripts

The backend already contains project-specific seed scripts. Use them only when you need their particular fixture data.

Examples:

```bash
npm --prefix backend run seed:student-demo
npm --prefix backend run seed:student-college
npm --prefix backend run seed:student-interviews
npm --prefix backend run seed:student-notifications
```

Some existing seed scripts are intentionally broad or destructive, so do not run `backend/scripts/seed.js` against anything other than your disposable local database.

## 9. Daily Git workflow

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
git push -u origin feature/<your-name>-<feature>
```

Open a Pull Request with:

```text
base: develop
compare: feature/<your-name>-<feature>
```

Do not push directly to `main` or `develop` unless the project owner explicitly instructs you to.

## 10. Keeping a feature branch current

```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch feature/<your-branch>
git merge develop
```

Resolve any conflicts, retest the feature, and then push.

## 11. ChatGPT / Codex

Use your own GitHub account and your own ChatGPT/Codex account. Connect GitHub from ChatGPT's Settings → Apps → GitHub, then select the repository when it becomes available.

When asking an AI coding assistant to work on the repository, tell it the exact branch first, for example:

```text
I am working in Pragati-student-module.
My current branch is feature/rahul-training-page.
The base branch is develop.
Read the existing implementation before making changes.
Do not modify unrelated functionality.
Implement the requested task on my branch and explain how to test it locally.
```

Always review AI-generated changes locally with `git diff`, then run the relevant tests/build before pushing.

## 12. Stop the local environment

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

The `-v` option deletes the local PostgreSQL, Redis, and Firebase emulator cache volumes. Use it only when you intentionally want a clean local environment.

## 13. Troubleshooting

### Docker is not running

Open Docker Desktop and retry:

```bash
npm run setup:dev
```

### Port already in use

The default ports are:

```text
5173  frontend
5000  backend
5432  PostgreSQL
6379  Redis
4000  Firebase UI
8080  Firestore emulator
9099  Auth emulator
```

Stop the process/container occupying the port before retrying.

### Firebase credential error

Check that the local backend environment contains:

```env
FIREBASE_PROJECT_ID=pragati-local
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
```

Do not add a production service-account key just to make local development work.

### PostgreSQL connection error

Run:

```bash
docker compose ps
```

The `postgres` container should be running. Then retry:

```bash
npm --prefix backend run migrate
```

## 14. Important security rules

Never commit:

- `backend/.env`
- Firebase service-account JSON
- API keys
- JWT secrets used outside local development
- production database credentials
- production Firebase credentials
- production Redis credentials

The repository's `.gitignore` already ignores backend `.env` and Firebase service-account JSON patterns.

## 15. Expected result

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
  ├── PostgreSQL :5432
  ├── Redis :6379
  └── Firebase Auth :9099
       Firestore :8080
```

No production service is required for the basic development workflow.
