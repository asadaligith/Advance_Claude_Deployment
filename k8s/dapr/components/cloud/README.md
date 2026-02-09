# Cloud Dapr Components

These component YAMLs are configured for cloud Kubernetes deployment.

## Setup

Before applying, create the required Kubernetes secrets:

```bash
# Application secrets (same as local but with cloud DB)
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL='postgresql+asyncpg://user:pass@cloud-host/db?ssl=require' \
  --from-literal=DAPR_DATABASE_URL='postgresql://user:pass@cloud-host/db?sslmode=require' \
  --from-literal=OPENAI_API_KEY='sk-your-key'

# Kafka credentials (only if using SASL auth)
kubectl create secret generic kafka-secrets \
  --from-literal=KAFKA_USERNAME='your-kafka-user' \
  --from-literal=KAFKA_PASSWORD='your-kafka-password'
```

## Configuration

1. **kafka-pubsub.yaml**: Update `brokers` with your cloud Kafka bootstrap address.
   - For internal Strimzi clusters, set `authType: none` and remove SASL fields.
   - For Redpanda Cloud / Confluent, keep `authType: password` with SASL credentials.

2. **statestore.yaml**: No changes needed if `todo-secrets` has the correct `DAPR_DATABASE_URL`.

3. **secrets.yaml**: No changes needed.

## Apply

```bash
kubectl apply -f k8s/dapr/components/cloud/
```
