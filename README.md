# Event-Driven Todo Chatbot (Cloud-Native)

An AI-powered task management system built with a distributed, event-driven microservices architecture. Manage tasks using natural language chat or a full-featured dashboard with priorities, tags, recurring tasks, reminders, search, and calendar views.

## Architecture Overview

```
                    +-------------------+
                    |    Frontend       |
                    |  (Next.js 15)     |
                    |  Port 3000        |
                    +--------+----------+
                             |
                             | REST API
                             v
                    +--------+----------+
                    |    Backend API     |
                    |  (FastAPI)         |
                    |  Port 8000         |
                    +--+------+------+--+
                       |      |      |
              Dapr     |      |      |   Dapr
             Pub/Sub   |      |      |  Pub/Sub
                       v      |      v
            +----------+--+   |  +---+-----------+
            | Recurring    |   |  | Notification  |
            | Task Service |   |  | Service       |
            | Port 8001    |   |  | Port 8002     |
            +--------------+   |  +---------------+
                               |
                    +----------+----------+
                    |   Neon PostgreSQL    |
                    |   (Async via Dapr)   |
                    +---------------------+

    Event Flow:
    Backend --[task-events]--> Kafka --[Dapr]--> Recurring Task Service
    Backend --[reminders]----> Kafka --[Dapr]--> Notification Service
```

### Key Design Principles

- **Dapr-First**: All infrastructure access (Pub/Sub, State, Secrets, Jobs) goes through Dapr sidecars -- zero direct client libraries
- **Event-Driven**: Task lifecycle events flow through Kafka topics via Dapr Pub/Sub
- **AI-Powered**: Natural language chat interface using OpenAI Agents SDK with MCP tools
- **Cloud-Native**: Kubernetes-ready with Helm charts, CI/CD, and horizontal scaling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Lucide Icons |
| Backend API | Python 3.12, FastAPI, SQLModel, Async SQLAlchemy |
| AI Agent | OpenAI Agents SDK, MCP Tools |
| Database | Neon PostgreSQL (async via asyncpg) |
| Messaging | Apache Kafka (Strimzi on K8s) |
| Sidecar | Dapr (Pub/Sub, State Store, Secrets, Jobs API) |
| Containerization | Docker (multi-stage builds) |
| Orchestration | Kubernetes, Helm Charts |
| CI/CD | GitHub Actions |
| Logging | structlog (JSON) with correlation IDs |

## Features

- **Task Dashboard** — Create, filter, sort, search, and manage tasks with priorities (high/medium/low), tags, and due dates
- **AI Chat Interface** — Natural language task management powered by OpenAI Agents SDK with MCP tools
- **Recurring Tasks** — Automatic next-occurrence creation on completion (daily, weekly, monthly, yearly)
- **Reminders & Notifications** — Due-date reminders via event-driven notification service
- **Calendar View** — Monthly calendar with task due dates and priority indicators
- **Full-Text Search** — Search tasks by title, description, or tags
- **UUID-Based Auth** — Simple `Authorization: Bearer <UUID>` authentication (UUID = user_id)

## Project Structure

```
phase5/
├── backend/                    # FastAPI Backend API
│   ├── app/
│   │   ├── api/                # Route handlers (tasks, tags, chat, health)
│   │   ├── models/             # SQLModel entities
│   │   ├── services/           # Business logic (task, tag, search, event, reminder)
│   │   ├── mcp/                # AI agent & MCP tool definitions
│   │   ├── config.py           # Settings (env vars + Dapr Secrets)
│   │   ├── database.py         # Async DB engine
│   │   ├── logging_config.py   # Structured JSON logging
│   │   └── main.py             # FastAPI app entry point
│   ├── alembic/                # Database migrations
│   ├── tests/                  # pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                   # Next.js Frontend (pnpm)
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Auth landing page (UUID input)
│   │   │   └── (dashboard)/    # Dashboard layout with sidebar
│   │   │       ├── tasks/      # Task dashboard page
│   │   │       ├── chat/       # AI chat page
│   │   │       └── calendar/   # Calendar view page
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components (Button, Card, Input, Badge, etc.)
│   │   │   ├── tasks/          # TaskCard, TaskList, TaskForm, SearchBar, FilterPanel
│   │   │   └── chat/           # ChatPanel, MessageList
│   │   └── lib/                # API client, types, auth, utils
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── services/
│   ├── recurring-task/         # Recurring Task Consumer Service
│   │   ├── app/
│   │   │   ├── handlers/       # Event handlers (task_completed)
│   │   │   ├── services/       # Recurrence calculator
│   │   │   └── main.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── notification/           # Notification Consumer Service
│       ├── app/
│       │   ├── handlers/       # Event handlers (reminder, job trigger)
│       │   ├── services/       # Notifier (console simulation)
│       │   └── main.py
│       ├── Dockerfile
│       └── requirements.txt
│
├── helm/                       # Helm Charts (one per service)
│   ├── backend/
│   ├── frontend/
│   ├── recurring-task-service/
│   └── notification-service/
│
├── k8s/                        # Kubernetes Manifests
│   ├── kafka/                  # Strimzi Kafka cluster + topics
│   └── dapr/components/
│       ├── *.yaml              # Local/Minikube Dapr components
│       └── cloud/              # Cloud-specific Dapr components (SASL Kafka)
│
├── .github/workflows/          # CI/CD Pipelines
│   ├── ci.yml                  # Lint, test, Docker build, Helm lint
│   └── deploy.yml              # Push images, Helm deploy
│
├── .env.example                # Environment variable template
└── README.md                   # This file
```

## Prerequisites

Install the following tools before starting:

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| **Python** | 3.12+ | Backend services | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 22+ | Frontend | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 10+ | Frontend package manager | `npm install -g pnpm` |
| **Docker** | 24+ | Containerization | [docker.com](https://docs.docker.com/get-docker/) |
| **Dapr CLI** | 1.14+ | Sidecar runtime | [dapr.io](https://docs.dapr.io/getting-started/install-dapr-cli/) |
| **kubectl** | 1.28+ | Kubernetes CLI | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |
| **Helm** | 3.14+ | Chart management | [helm.sh](https://helm.sh/docs/intro/install/) |
| **Minikube** | 1.32+ | Local K8s cluster | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com/) |

### Verify installations

```bash
python --version        # Python 3.12+
node --version          # v22+
pnpm --version          # 10+
docker --version        # Docker 24+
dapr --version          # CLI version 1.14+
kubectl version --client
helm version
minikube version
```

## Environment Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/asadaligith/Advance_Claude_Deployment.git
cd Advance_Claude_Deployment
```

### Step 2: Configure environment variables

```bash
# Copy the template
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database — Neon PostgreSQL connection string (async driver for app)
DATABASE_URL=postgresql+asyncpg://user:password@your-neon-host.neon.tech/dbname?sslmode=require

# Dapr state store — standard PostgreSQL URL (no +asyncpg, use sslmode=require)
DAPR_DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require

# Dapr sidecar port (default 3500)
DAPR_HTTP_PORT=3500

# OpenAI API key for the AI chat agent
OPENAI_API_KEY=sk-your-openai-api-key

# Authentication
BETTER_AUTH_SECRET=your-random-secret-string
BETTER_AUTH_URL=http://localhost:3000

# Frontend → Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Inter-service communication
BACKEND_API_URL=http://localhost:8000
```

> **Important**: `DATABASE_URL` uses `postgresql+asyncpg://` for the app's async driver. `DAPR_DATABASE_URL` uses standard `postgresql://` with `sslmode=require` for Dapr's pgx driver. Both point to the same Neon database.

### Step 3: Set up Neon PostgreSQL

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string into your `.env` file as `DATABASE_URL`
4. Make sure to use the `postgresql+asyncpg://` prefix (not `postgres://`)

---

## Running Locally (Development Mode)

### Backend API

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`.

**Authentication**: Open the browser, enter any UUID (or click "Generate UUID") on the landing page. This UUID becomes your user identity — all tasks are scoped to it via `Authorization: Bearer <UUID>` headers.

### Recurring Task Service

```bash
cd services/recurring-task

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the service
uvicorn app.main:app --reload --port 8001
```

### Notification Service

```bash
cd services/notification

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the service
uvicorn app.main:app --reload --port 8002
```

---

## Testing

### Backend Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
python -m pytest tests/ -v --tb=short

# Run with coverage
python -m pytest tests/ -v --cov=app --cov-report=term-missing
```

### Backend Linting

```bash
cd backend

# Install linter
pip install ruff

# Check lint errors
ruff check .

# Check formatting
ruff format --check .

# Auto-fix lint errors
ruff check . --fix

# Auto-format code
ruff format .
```

### Frontend Tests

```bash
cd frontend

# Type checking
pnpm exec tsc --noEmit

# ESLint
pnpm exec next lint

# Run all checks
pnpm lint
```

### Helm Chart Validation

```bash
helm lint helm/backend
helm lint helm/frontend
helm lint helm/recurring-task-service
helm lint helm/notification-service
```

---

## Docker Setup

### Build all images

```bash
# Backend API
docker build -t todo-backend:latest ./backend

# Frontend
docker build -t todo-frontend:latest ./frontend

# Recurring Task Service
docker build -t todo-recurring-task:latest ./services/recurring-task

# Notification Service
docker build -t todo-notification:latest ./services/notification
```

### Run with Docker (standalone, without Dapr)

```bash
# Backend
docker run -d --name todo-backend \
  -p 8000:8000 \
  -e DATABASE_URL="your-neon-connection-string" \
  -e OPENAI_API_KEY="your-key" \
  todo-backend:latest

# Frontend
docker run -d --name todo-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL="http://host.docker.internal:8000" \
  todo-frontend:latest
```

### Verify images

```bash
docker images | grep todo
```

---

## Kubernetes Deployment (Minikube)

This is the full hands-on guide for deploying the complete event-driven system.

### Step 1: Start Minikube

```bash
# Start cluster with sufficient resources
minikube start --cpus=4 --memory=8192 --driver=docker

# Verify
kubectl cluster-info
kubectl get nodes
```

### Step 2: Install Dapr on the cluster

```bash
# Initialize Dapr in Kubernetes mode
dapr init -k

# Verify Dapr is running
dapr status -k

# Expected output: dapr-operator, dapr-sentry, dapr-sidecar-injector, dapr-placement — all Running
kubectl get pods -n dapr-system
```

### Step 3: Deploy Strimzi Kafka

```bash
# Install Strimzi operator
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka

# Wait for Strimzi operator to be ready
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka cluster
kubectl apply -f k8s/kafka/kafka-cluster.yaml -n kafka

# Wait for Kafka to be ready (takes 2-5 minutes)
kubectl wait kafka/todo-kafka --for=condition=Ready -n kafka --timeout=600s

# Deploy Kafka topics (after cluster is ready)
kubectl apply -f k8s/kafka/kafka-topics.yaml -n kafka

# Verify
kubectl get kafka -n kafka
kubectl get kafkatopics -n kafka
```

### Step 4: Create Kubernetes Secrets

```bash
# Create the secret with your actual values
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL="postgresql+asyncpg://user:pass@host.neon.tech/db?sslmode=require" \
  --from-literal=DAPR_DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require" \
  --from-literal=OPENAI_API_KEY="sk-your-key" \
  --from-literal=BETTER_AUTH_SECRET="your-secret"

# Verify
kubectl get secret todo-secrets
```

> **Note**: `DAPR_DATABASE_URL` uses standard `postgresql://` (not `+asyncpg`) — Dapr's pgx driver requires this format.

### Step 5: Deploy Dapr Components

```bash
# Apply Dapr component configurations
kubectl apply -f k8s/dapr/components/kafka-pubsub.yaml
kubectl apply -f k8s/dapr/components/statestore.yaml
kubectl apply -f k8s/dapr/components/secrets.yaml

# Verify
kubectl get components.dapr.io
```

### Step 6: Build and load Docker images into Minikube

```bash
# Build Docker images locally
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
docker build -t todo-recurring-task:latest ./services/recurring-task
docker build -t todo-notification:latest ./services/notification

# Load images into Minikube (works on all platforms including Windows)
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
minikube image load todo-recurring-task:latest
minikube image load todo-notification:latest

# Verify images are in Minikube
minikube image ls | grep todo
```

### Step 7: Deploy services via Helm

```bash
# Install all 4 services
helm install backend ./helm/backend
helm install frontend ./helm/frontend
helm install recurring-task-service ./helm/recurring-task-service
helm install notification-service ./helm/notification-service

# Watch pods come up (wait for all to show Running with 2/2 — app + Dapr sidecar)
kubectl get pods -w

# Expected output:
# NAME                              READY   STATUS    RESTARTS   AGE
# backend-xxxxx                     2/2     Running   0          60s
# frontend-xxxxx                    2/2     Running   0          55s
# recurring-task-service-xxxxx      2/2     Running   0          50s
# notification-service-xxxxx        2/2     Running   0          45s
```

### Step 8: Verify deployment

```bash
# Check all pods are running with Dapr sidecars
kubectl get pods

# Check Dapr sidecar logs
kubectl logs <backend-pod-name> daprd

# Check application logs
kubectl logs <backend-pod-name> backend

# Check services
kubectl get svc
```

### Step 9: Access the application

```bash
# Port-forward the frontend
kubectl port-forward svc/frontend 3000:3000

# Port-forward the backend API (for direct API access)
kubectl port-forward svc/backend 8000:8000
```

Open `http://localhost:3000` in your browser.

### Step 10: End-to-end verification

All API calls use `Authorization: Bearer <UUID>` where the UUID is the user identity:

```bash
# Set your test user UUID
export USER_ID="550e8400-e29b-41d4-a716-446655440000"

# 1. Test backend health
curl http://localhost:8000/healthz
# Expected: {"status": "healthy"}

curl http://localhost:8000/readyz
# Expected: {"status": "ready", "database": "ok", "dapr": "ok"}

# 2. Create a task via API
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_ID" \
  -d '{
    "title": "Test recurring task",
    "priority": "high",
    "is_recurring": true,
    "recurrence_pattern": {"type": "daily"},
    "due_date": "2026-02-10T10:00:00Z",
    "reminder_offset": "1h"
  }'

# 3. List tasks
curl -H "Authorization: Bearer $USER_ID" \
  http://localhost:8000/api/tasks

# 4. Check dashboard stats
curl -H "Authorization: Bearer $USER_ID" \
  http://localhost:8000/api/tasks/dashboard

# 5. Complete the task (triggers event to recurring-task service)
curl -X POST -H "Authorization: Bearer $USER_ID" \
  http://localhost:8000/api/tasks/1/complete

# 6. Verify next occurrence was auto-created by recurring-task service
curl -H "Authorization: Bearer $USER_ID" \
  http://localhost:8000/api/tasks

# 7. Chat with AI agent
curl -X POST http://localhost:8000/api/$USER_ID/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_ID" \
  -d '{"message": "Add a daily task to exercise at 7am with a 15 minute reminder"}'

# 8. Check recurring-task service logs for event processing
kubectl logs -l app=recurring-task-service -c recurring-task-service

# 9. Check notification service logs for reminder scheduling
kubectl logs -l app=notification-service -c notification-service
```

---

## Cloud Deployment

### Option A: Using Helm values-cloud.yaml

Each service has a `values-cloud.yaml` for cloud-specific settings (image registry, replicas, resources).

```bash
# Push images to your registry
docker tag todo-backend:latest your-registry/todo-backend:latest
docker push your-registry/todo-backend:latest
# Repeat for all 4 services

# Apply cloud-specific Dapr components (SASL Kafka auth, cloud secrets)
kubectl apply -f k8s/dapr/components/cloud/

# Deploy with cloud values
helm install backend ./helm/backend -f helm/backend/values-cloud.yaml
helm install frontend ./helm/frontend -f helm/frontend/values-cloud.yaml
helm install recurring-task-service ./helm/recurring-task-service -f helm/recurring-task-service/values-cloud.yaml
helm install notification-service ./helm/notification-service -f helm/notification-service/values-cloud.yaml
```

> See `k8s/dapr/components/cloud/README.md` for cloud Kafka and secrets configuration details.

### Option B: CI/CD via GitHub Actions

Configure these repository secrets in GitHub Settings > Secrets:

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub / registry username |
| `DOCKER_PASSWORD` | Docker Hub / registry password |
| `KUBE_CONFIG` | Base64-encoded kubeconfig for your cloud cluster |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |

Then push to `main` branch -- the CI/CD pipeline will:
1. **CI** (`ci.yml`): Lint, type-check, test, build Docker images, lint Helm charts
2. **Deploy** (`deploy.yml`): Push images to registry, deploy via Helm

---

## API Endpoints

All endpoints (except health) require the `Authorization: Bearer <UUID>` header, where the UUID is the user identity.

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | List tasks (with filters, search, sort, pagination) |
| GET | `/api/tasks/dashboard` | Dashboard statistics |
| GET | `/api/tasks/{id}` | Get a single task |
| PATCH | `/api/tasks/{id}` | Update a task |
| POST | `/api/tasks/{id}/complete` | Complete a task |
| POST | `/api/tasks/{id}/reopen` | Reopen a completed task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| GET | `/api/tasks/{id}/completions` | Completion history (recurring) |

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | List tags (with `?q=` autocomplete) |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/{user_id}/chat` | Send message to AI agent |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthz` | Liveness probe |
| GET | `/readyz` | Readiness probe (DB + Dapr) |

### Query Parameters for GET /api/tasks

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Full-text search |
| `status` | string | Filter: pending, completed |
| `priority` | string | Filter: high, medium, low |
| `tags` | string | Filter by tag name |
| `due_from` | datetime | Due date range start |
| `due_to` | datetime | Due date range end |
| `sort_by` | string | Sort field: created_at, due_date, priority |
| `sort_order` | string | asc or desc |
| `page` | int | Page number (default 1) |
| `page_size` | int | Items per page (default 20) |

---

## Event Topics (Kafka via Dapr)

| Topic | Publisher | Consumer | Payload |
|-------|-----------|----------|---------|
| `task-events` | Backend | Recurring Task Service | TaskEvent (created/updated/completed/deleted) |
| `reminders` | Backend | Notification Service | ReminderEvent (scheduled/cancelled) |
| `task-updates` | Recurring Task Service | Backend | New task creation from recurrence |

---

## Troubleshooting

### Common Issues

**Backend won't start — database connection error**
```bash
# Verify your DATABASE_URL in .env
# Ensure Neon database is accessible
# Check if migrations ran: alembic current
alembic upgrade head
```

**Dapr sidecar not injecting (pods show 1/1 instead of 2/2)**
```bash
# Verify Dapr is installed
dapr status -k

# Check Dapr annotations in Helm values
kubectl describe pod <pod-name> | grep dapr

# Restart Dapr
dapr uninstall -k && dapr init -k
```

**Kafka events not flowing**
```bash
# Check Kafka is running
kubectl get kafka -n kafka

# Check Dapr Pub/Sub component
kubectl get components.dapr.io

# Check Dapr sidecar logs for subscription errors
kubectl logs <pod-name> daprd | grep -i "error\|subscribe"
```

**Frontend Docker build fails**
```bash
# Ensure public/ directory exists
ls frontend/public/

# Ensure standalone output is configured in next.config.ts
grep "standalone" frontend/next.config.ts
```

**Ruff lint failures**
```bash
cd backend
ruff check . --fix   # Auto-fix lint errors
ruff format .        # Auto-format code
```

### Useful Commands

```bash
# View all running services
kubectl get pods,svc,components.dapr.io

# Tail logs for a service
kubectl logs -f deployment/backend -c backend

# Restart a deployment
kubectl rollout restart deployment/backend

# Uninstall everything
helm uninstall backend frontend recurring-task-service notification-service

# Delete Minikube cluster
minikube delete
```

---

## License

This project is part of the GIAIC Hackathon Q4 — Phase 5 (Cloud-Native Development).
