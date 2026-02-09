# Step 3: Run the Backend API

The backend is a Python FastAPI application that connects to Neon PostgreSQL.

## 3.1 Open a Terminal

Navigate to the backend directory:

```bash
cd backend
```

## 3.2 Create Virtual Environment

```bash
python -m venv venv
```

## 3.3 Activate Virtual Environment

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

## 3.4 Install Dependencies

```bash
pip install -r requirements.txt
```

This installs: FastAPI, SQLModel, asyncpg, Alembic, OpenAI Agents SDK, structlog, and more.

## 3.5 Copy .env to Backend Directory

The backend reads `.env` from its own directory:

**Windows (PowerShell):**
```powershell
copy ..\.env .env
```

**macOS / Linux:**
```bash
cp ../.env .env
```

## 3.6 Run Database Migrations

This creates all tables in your Neon database:

```bash
alembic upgrade head
```

Expected output:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade ... -> ...
```

If you get a connection error, check your `DATABASE_URL` in `.env`.

## 3.7 Start the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## 3.8 Verify the Backend is Running

Open a **new terminal** (keep the backend running) and test:

```bash
# Health check
curl http://localhost:8000/healthz
# Expected: {"status":"healthy"}

# API docs (open in browser)
# http://localhost:8000/docs
```

## 3.9 Test API Endpoints

```bash
# Set a test user UUID
set USER_ID=550e8400-e29b-41d4-a716-446655440000

# Create a task
curl -X POST http://localhost:8000/api/tasks ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %USER_ID%" ^
  -d "{\"title\": \"My first task\", \"priority\": \"high\"}"

# List tasks
curl -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks

# Dashboard stats
curl -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks/dashboard
```

**For PowerShell, use `$env:USER_ID` instead of `%USER_ID%`:**
```powershell
$USER_ID = "550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:8000/api/tasks `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $USER_ID" `
  -d '{"title": "My first task", "priority": "high"}'
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Make sure venv is activated: `venv\Scripts\activate` |
| `Connection refused` (database) | Check `DATABASE_URL` in `backend/.env` |
| `alembic: command not found` | Run: `pip install alembic` |
| Port 8000 already in use | Use `--port 8001` or kill the process on 8000 |

## Stop the Backend

Press `Ctrl+C` in the terminal running uvicorn.

---

Keep this terminal running and proceed to Step 4 (Frontend).
