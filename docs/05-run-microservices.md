# Step 5: Run the Microservices (Recurring Task + Notification)

These two services consume events from the backend via Kafka/Dapr:
- **Recurring Task Service** (port 8001): Auto-creates next task occurrences when a recurring task is completed
- **Notification Service** (port 8002): Handles due-date reminders

**Note:** These services require Dapr and Kafka to be running for full event-driven functionality. Without Dapr, they will start but won't receive events.

## 5.1 Recurring Task Service

### Open a New Terminal

```bash
cd services/recurring-task
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start the Service

```bash
uvicorn app.main:app --reload --port 8001
```

### Verify

```bash
curl http://localhost:8001/healthz
# Expected: {"status":"healthy"}
```

---

## 5.2 Notification Service

### Open a New Terminal

```bash
cd services/notification
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start the Service

```bash
uvicorn app.main:app --reload --port 8002
```

### Verify

```bash
curl http://localhost:8002/healthz
# Expected: {"status":"healthy"}
```

---

## 5.3 Running with Dapr (Full Event-Driven Mode)

To get the full event-driven system working locally, start each service with Dapr:

### Initialize Dapr (one time only)

```bash
dapr init
```

### Start Backend with Dapr

```bash
cd backend
dapr run --app-id backend --app-port 8000 --dapr-http-port 3500 -- uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Recurring Task Service with Dapr

```bash
cd services/recurring-task
dapr run --app-id recurring-task-service --app-port 8001 --dapr-http-port 3501 -- uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Start Notification Service with Dapr

```bash
cd services/notification
dapr run --app-id notification-service --app-port 8002 --dapr-http-port 3502 -- uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

---

## Summary: All Running Services

| Service | Port | Terminal | Command |
|---------|------|----------|---------|
| Backend API | 8000 | Terminal 1 | `uvicorn app.main:app --reload --port 8000` |
| Frontend | 3000 | Terminal 2 | `pnpm dev` |
| Recurring Task | 8001 | Terminal 3 | `uvicorn app.main:app --reload --port 8001` |
| Notification | 8002 | Terminal 4 | `uvicorn app.main:app --reload --port 8002` |

You need **4 terminals** open to run the full system locally.

---

Proceed to Step 6 (Testing) or Step 7 (Kubernetes) for deployment.
