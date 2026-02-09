# Step 1: Prerequisites

Install all required tools before proceeding.

## Required Software

| Tool | Version | Check Command | Install |
|------|---------|---------------|---------|
| Python | 3.12+ | `python --version` | https://www.python.org/downloads/ |
| Node.js | 22+ | `node --version` | https://nodejs.org/ |
| pnpm | 10+ | `pnpm --version` | `npm install -g pnpm` |
| Git | 2.40+ | `git --version` | https://git-scm.com/ |

## Required for Kubernetes Deployment (Optional for Local Dev)

| Tool | Version | Check Command | Install |
|------|---------|---------------|---------|
| Docker | 24+ | `docker --version` | https://docs.docker.com/get-docker/ |
| Dapr CLI | 1.14+ | `dapr --version` | https://docs.dapr.io/getting-started/install-dapr-cli/ |
| kubectl | 1.28+ | `kubectl version --client` | https://kubernetes.io/docs/tasks/tools/ |
| Helm | 3.14+ | `helm version` | https://helm.sh/docs/intro/install/ |
| Minikube | 1.32+ | `minikube version` | https://minikube.sigs.k8s.io/docs/start/ |

## Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| Neon PostgreSQL | Cloud database (free tier) | https://neon.tech |
| OpenAI | AI chat agent API key | https://platform.openai.com |

## Verify All Tools

Run this in your terminal to verify everything is installed:

```bash
python --version
node --version
pnpm --version
git --version
```

If any command fails, install that tool before continuing to Step 2.
