# Step 7: Kubernetes Deployment (Minikube)

Deploy the full event-driven system to a local Kubernetes cluster.

**Prerequisites:** Docker, kubectl, Helm, Minikube, and Dapr CLI must be installed (see Step 1).

---

## 7.1 Start Minikube

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

Verify:
```bash
kubectl cluster-info
kubectl get nodes
```

---

## 7.2 Install Dapr on the Cluster

```bash
dapr init -k
```

Verify (all 4 components should be Running):
```bash
dapr status -k
kubectl get pods -n dapr-system
```

---

## 7.3 Deploy Strimzi Kafka

```bash
# Install Strimzi operator
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka

# Wait for operator
kubectl wait --for=condition=Ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka cluster
kubectl apply -f k8s/kafka/kafka-cluster.yaml -n kafka

# Wait for Kafka to be ready (2-5 minutes)
kubectl wait kafka/todo-kafka --for=condition=Ready -n kafka --timeout=600s

# Deploy topics (after cluster is ready)
kubectl apply -f k8s/kafka/kafka-topics.yaml -n kafka

# Verify
kubectl get kafka -n kafka
kubectl get kafkatopics -n kafka
```

---

## 7.4 Create Kubernetes Secrets

Replace with your actual Neon credentials:

```bash
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL="postgresql+asyncpg://user:pass@host.neon.tech/db?sslmode=require" \
  --from-literal=DAPR_DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require" \
  --from-literal=OPENAI_API_KEY="sk-your-key" \
  --from-literal=BETTER_AUTH_SECRET="any-random-string"
```

Verify:
```bash
kubectl get secret todo-secrets
```

---

## 7.5 Deploy Dapr Components

```bash
kubectl apply -f k8s/dapr/components/kafka-pubsub.yaml
kubectl apply -f k8s/dapr/components/statestore.yaml
kubectl apply -f k8s/dapr/components/secrets.yaml
```

Verify:
```bash
kubectl get components.dapr.io
```

---

## 7.6 Build and Load Docker Images

```bash
# Build images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
docker build -t todo-recurring-task:latest ./services/recurring-task
docker build -t todo-notification:latest ./services/notification

# Load into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
minikube image load todo-recurring-task:latest
minikube image load todo-notification:latest

# Verify
minikube image ls | grep todo
```

---

## 7.7 Deploy via Helm

```bash
helm install backend ./helm/backend
helm install frontend ./helm/frontend
helm install recurring-task-service ./helm/recurring-task-service
helm install notification-service ./helm/notification-service
```

Watch pods come up (wait for 2/2 Ready — app + Dapr sidecar):
```bash
kubectl get pods -w
```

Expected:
```
NAME                                      READY   STATUS    RESTARTS   AGE
backend-backend-xxxxx                     2/2     Running   0          60s
frontend-frontend-xxxxx                   1/1     Running   0          55s
recurring-task-service-recurring-xxxxx    2/2     Running   0          50s
notification-service-notification-xxxxx   2/2     Running   0          45s
```

---

## 7.8 Access the Application

```bash
# Frontend (open http://localhost:3000 in browser)
kubectl port-forward svc/frontend-frontend 3000:3000

# Backend API (open http://localhost:8000/docs for Swagger)
kubectl port-forward svc/backend-backend 8000:8000
```

---

## 7.9 Verify End-to-End

```bash
# Health checks
curl http://localhost:8000/healthz
curl http://localhost:8000/readyz

# Create and complete a recurring task
set USER_ID=550e8400-e29b-41d4-a716-446655440000

curl -X POST http://localhost:8000/api/tasks ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %USER_ID%" ^
  -d "{\"title\":\"Daily standup\",\"priority\":\"high\",\"is_recurring\":true,\"recurrence_pattern\":{\"type\":\"daily\"}}"

curl -X POST -H "Authorization: Bearer %USER_ID%" http://localhost:8000/api/tasks/1/complete

# Check logs for event processing
kubectl logs -l app=recurring-task-service-recurring-task -c recurring-task
kubectl logs -l app=notification-service-notification -c notification
```

---

## 7.10 Cleanup

```bash
# Uninstall Helm releases
helm uninstall backend frontend recurring-task-service notification-service

# Delete Kafka
kubectl delete -f k8s/kafka/ -n kafka

# Delete Dapr
dapr uninstall -k

# Stop Minikube
minikube stop

# Delete Minikube cluster (to free disk space)
minikube delete
```
