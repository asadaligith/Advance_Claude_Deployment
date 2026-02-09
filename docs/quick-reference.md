# Quick Reference: All Commands

Copy-paste cheat sheet for running the project.

---

## Local Development (4 Terminals)

### Terminal 1: Backend API (port 8000)

```bash
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
# source venv/bin/activate         # macOS/Linux
pip install -r requirements.txt
copy ..\.env .env                  # Windows
# cp ../.env .env                  # macOS/Linux
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend (port 3000)

```bash
cd frontend
pnpm install
pnpm dev
```

### Terminal 3: Recurring Task Service (port 8001)

```bash
cd services/recurring-task
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Terminal 4: Notification Service (port 8002)

```bash
cd services/notification
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/healthz |
| Readiness Check | http://localhost:8000/readyz |

---

## API Quick Test (PowerShell)

```powershell
$USER_ID = "550e8400-e29b-41d4-a716-446655440000"

# Create a task
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/tasks `
  -Headers @{"Authorization"="Bearer $USER_ID"; "Content-Type"="application/json"} `
  -Body '{"title":"Hello World","priority":"medium"}'

# List tasks
Invoke-RestMethod -Uri http://localhost:8000/api/tasks `
  -Headers @{"Authorization"="Bearer $USER_ID"}

# Dashboard
Invoke-RestMethod -Uri http://localhost:8000/api/tasks/dashboard `
  -Headers @{"Authorization"="Bearer $USER_ID"}
```

---

## API Quick Test (curl / bash)

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"

# Create a task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_ID" \
  -d '{"title":"Hello World","priority":"medium"}'

# List tasks
curl -H "Authorization: Bearer $USER_ID" http://localhost:8000/api/tasks

# Dashboard
curl -H "Authorization: Bearer $USER_ID" http://localhost:8000/api/tasks/dashboard

# Chat with AI
curl -X POST http://localhost:8000/api/$USER_ID/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_ID" \
  -d '{"message":"Add a task to buy groceries"}'
```

---

## Kubernetes (Minikube)

```bash
# Start cluster
minikube start --cpus=4 --memory=8192 --driver=docker

# Install Dapr
dapr init -k

# Deploy Kafka
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka
kubectl wait --for=condition=Ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s
kubectl apply -f k8s/kafka/kafka-cluster.yaml -n kafka
kubectl wait kafka/todo-kafka --for=condition=Ready -n kafka --timeout=600s
kubectl apply -f k8s/kafka/kafka-topics.yaml -n kafka

# Create secrets (replace with your values)
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL="postgresql+asyncpg://..." \
  --from-literal=DAPR_DATABASE_URL="postgresql://..." \
  --from-literal=OPENAI_API_KEY="sk-..." \
  --from-literal=BETTER_AUTH_SECRET="random-string"

# Deploy Dapr components
kubectl apply -f k8s/dapr/components/

# Build and load images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
docker build -t todo-recurring-task:latest ./services/recurring-task
docker build -t todo-notification:latest ./services/notification
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
minikube image load todo-recurring-task:latest
minikube image load todo-notification:latest

# Deploy
helm install backend ./helm/backend
helm install frontend ./helm/frontend
helm install recurring-task-service ./helm/recurring-task-service
helm install notification-service ./helm/notification-service

# Access
kubectl port-forward svc/frontend-frontend 3000:3000
kubectl port-forward svc/backend-backend 8000:8000
```

---

## Linting & Testing

```bash
# Backend
cd backend && pip install ruff pytest pytest-asyncio httpx
ruff check .
ruff format --check .
python -m pytest tests/ -v --tb=short

# Frontend
cd frontend
pnpm exec tsc --noEmit
pnpm lint

# Helm
helm lint helm/backend helm/frontend helm/recurring-task-service helm/notification-service
```

---

## Stop Everything

```bash
# Stop local services: Ctrl+C in each terminal

# Stop Minikube
helm uninstall backend frontend recurring-task-service notification-service
minikube stop
```
