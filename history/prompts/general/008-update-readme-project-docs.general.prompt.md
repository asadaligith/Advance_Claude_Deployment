---
id: 008
title: Update README with project docs and running commands
stage: general
date: 2026-02-09
surface: agent
model: claude-opus-4-6
feature: none
branch: main
user: asadaligith
command: update md file
labels: ["documentation", "readme", "devops"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - README.md
tests:
  - none
---

## Prompt

update md file about projects and running commands

## Response snapshot

Updated README.md with 12 targeted corrections reflecting the current project state:
1. Added shadcn/ui and Lucide Icons to tech stack table
2. Added Features section (7 features: dashboard, chat, recurring, reminders, calendar, search, UUID auth)
3. Updated project structure tree (frontend pnpm, ui/ components, cloud Dapr, auth landing page, route layout)
4. Added pnpm to prerequisites table and verify commands
5. Added DAPR_DATABASE_URL to environment setup with explanation note
6. Changed all frontend commands from npm to pnpm (install, dev, lint, tsc)
7. Added auth explanation for frontend (UUID landing page)
8. Updated K8s secrets step to include DAPR_DATABASE_URL with format note
9. Changed Minikube image loading from `eval $(minikube docker-env)` to `minikube image load` (cross-platform)
10. Fixed Kafka deployment order (cluster first, wait, then topics)
11. Updated all E2E verification curl commands to use `Authorization: Bearer <UUID>` headers
12. Added cloud Dapr components reference in cloud deployment section

## Outcome

- ✅ Impact: README now accurately reflects the deployed system (pnpm, Bearer auth, DAPR_DATABASE_URL, cloud components)
- 🧪 Tests: none (documentation only)
- 📁 Files: 1 modified (README.md)
- 🔁 Next prompts: Commit and push changes
- 🧠 Reflection: README had 12+ stale sections from earlier development phases; keeping docs in sync with implementation requires periodic audits

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
