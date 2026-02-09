# Step 6: Testing

## 6.1 Backend Unit Tests

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
python -m pytest tests/ -v --tb=short

# Run with coverage report
python -m pytest tests/ -v --cov=app --cov-report=term-missing
```

## 6.2 Backend Linting

```bash
cd backend

# Install linter
pip install ruff

# Check for lint errors
ruff check .

# Check formatting
ruff format --check .

# Auto-fix lint errors
ruff check . --fix

# Auto-format code
ruff format .
```

## 6.3 Frontend Type Checking

```bash
cd frontend

# TypeScript type check (zero errors expected)
pnpm exec tsc --noEmit

# ESLint
pnpm exec next lint

# Or run all lint checks
pnpm lint
```

## 6.4 Helm Chart Linting

```bash
helm lint helm/backend
helm lint helm/frontend
helm lint helm/recurring-task-service
helm lint helm/notification-service
```

## 6.5 Docker Build Test

Verify all Docker images build successfully:

```bash
# Backend
docker build -t todo-backend:test ./backend

# Frontend
docker build -t todo-frontend:test ./frontend

# Recurring Task Service
docker build -t todo-recurring-task:test ./services/recurring-task

# Notification Service
docker build -t todo-notification:test ./services/notification
```

## 6.6 API Integration Tests

With the backend running on port 8000:

```bash
# Set test user
set USER_ID=550e8400-e29b-41d4-a716-446655440000

# 1. Health check
curl http://localhost:8000/healthz

# 2. Create a task
curl -X POST http://localhost:8000/api/tasks ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %USER_ID%" ^
  -d "{\"title\":\"Test task\",\"priority\":\"high\",\"tags\":[\"test\"]}"

# 3. List all tasks
curl -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks

# 4. Search tasks
curl -H "Authorization: Bearer %USER_ID%" "http://localhost:8000/api/tasks?q=test"

# 5. Filter by priority
curl -H "Authorization: Bearer %USER_ID%" "http://localhost:8000/api/tasks?priority=high"

# 6. Dashboard stats
curl -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks/dashboard

# 7. Complete a task (replace 1 with actual task ID)
curl -X POST -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks/1/complete

# 8. Delete a task
curl -X DELETE -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks/1

# 9. Chat with AI (requires OPENAI_API_KEY)
curl -X POST http://localhost:8000/api/%USER_ID%/chat ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %USER_ID%" ^
  -d "{\"message\":\"Add a task to buy groceries tomorrow\"}"
```

### PowerShell Version

```powershell
$USER_ID = "550e8400-e29b-41d4-a716-446655440000"

# Health check
Invoke-RestMethod http://localhost:8000/healthz

# Create a task
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/tasks `
  -Headers @{"Authorization"="Bearer $USER_ID"; "Content-Type"="application/json"} `
  -Body '{"title":"Test task","priority":"high","tags":["test"]}'

# List tasks
Invoke-RestMethod -Uri http://localhost:8000/api/tasks `
  -Headers @{"Authorization"="Bearer $USER_ID"}

# Dashboard
Invoke-RestMethod -Uri http://localhost:8000/api/tasks/dashboard `
  -Headers @{"Authorization"="Bearer $USER_ID"}
```
