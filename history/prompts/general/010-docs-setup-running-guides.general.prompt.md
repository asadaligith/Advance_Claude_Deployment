---
id: 010
title: Create project setup and running guide docs
stage: general
date: 2026-02-10
surface: agent
model: claude-opus-4-6
feature: none
branch: docs-setup-guide
user: asadaligith
command: /sp.git.commit_pr
labels: ["documentation", "setup", "guides", "git"]
links:
  spec: null
  ticket: null
  adr: null
  pr: https://github.com/asadaligith/Advance_Claude_Deployment/pull/new/docs-setup-guide
files:
  - docs/01-prerequisites.md
  - docs/02-environment-setup.md
  - docs/03-run-backend.md
  - docs/04-run-frontend.md
  - docs/05-run-microservices.md
  - docs/06-testing.md
  - docs/07-kubernetes-deployment.md
  - docs/quick-reference.md
  - .gitignore
tests:
  - none
---

## Prompt

create project running command files and write all commands step by step for guidance all frontend backend

Then: /sp.git.commit_pr

## Response snapshot

Created 8 step-by-step guide files in docs/ covering the full project lifecycle:
1. Prerequisites (tools, versions, install links)
2. Environment setup (clone, .env, Neon DB)
3. Backend (venv, deps, migrations, server, API tests)
4. Frontend (pnpm, dev server, page usage guide)
5. Microservices (recurring-task + notification, Dapr mode)
6. Testing (unit, lint, Helm, API integration — curl + PowerShell)
7. Kubernetes deployment (Minikube, Dapr, Kafka, Helm, cleanup)
8. Quick-reference cheat sheet (all commands on one page)

Git workflow:
- Created branch `docs-setup-guide` from `main`
- Committed 9 files (1071 lines added)
- Pushed to origin
- PR creation blocked by GitHub API rate limit (429) — manual link provided

## Outcome

- ✅ Impact: Comprehensive project documentation for onboarding and deployment
- 🧪 Tests: none (documentation only)
- 📁 Files: 9 files (8 docs + .gitignore)
- 🔁 Next prompts: Create PR manually via GitHub UI, then merge to main
- 🧠 Reflection: GitHub API rate limits can block `gh pr create`; provide manual fallback URL

## Evaluation notes (flywheel)

- Failure modes observed: GitHub API 429 rate limit on PR creation (3 retries failed)
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add retry backoff or use REST API fallback
