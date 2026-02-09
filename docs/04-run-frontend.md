# Step 4: Run the Frontend

The frontend is a Next.js 15 application with React 19, Tailwind CSS 4, and shadcn/ui.

**Prerequisite:** Backend must be running on port 8000 (see Step 3).

## 4.1 Open a New Terminal

Navigate to the frontend directory:

```bash
cd frontend
```

## 4.2 Install Dependencies

```bash
pnpm install
```

Expected output:
```
Packages: +XXX
++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX
Done in X.Xs
```

If `pnpm` is not found, install it first: `npm install -g pnpm`

## 4.3 Start the Development Server

```bash
pnpm dev
```

Expected output:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Network:      http://xxx.xxx.xxx.xxx:3000

✓ Starting...
✓ Ready in X.Xs
```

## 4.4 Open the App in Your Browser

Go to: **http://localhost:3000**

You will see the **Landing Page** with:
- A UUID input field
- A "Generate UUID" button
- A "Sign In" button

## 4.5 Sign In

1. Click **"Generate UUID"** — this creates a random user ID
2. Click **"Sign In"**
3. You'll be redirected to the **Tasks Dashboard** at `/tasks`

## 4.6 Using the App

### Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing / Auth | `/` | Enter UUID to sign in |
| Tasks Dashboard | `/tasks` | Create, view, filter, complete tasks |
| AI Chat | `/chat` | Chat with AI to manage tasks |
| Calendar | `/calendar` | Monthly calendar view of tasks |

### Tasks Dashboard (`/tasks`)
- **Create a task**: Type in the quick-add bar, click "Add"
- **Expand form**: Click the expand icon for full form (priority, tags, due date, recurring)
- **Filter tasks**: Use the filter panel (status, priority, tags, sort)
- **Search**: Type in the search bar to search across tasks
- **Complete a task**: Click the checkmark icon on a task card
- **Delete a task**: Click the trash icon on a task card

### AI Chat (`/chat`)
- Type a message like: *"Add a high priority task to review the project by Friday"*
- The AI will create tasks, set priorities, and manage your todo list
- Requires `OPENAI_API_KEY` in the backend `.env`

### Calendar (`/calendar`)
- View tasks by due date on a monthly calendar
- Navigate months with arrow buttons
- Tasks are shown with colored priority dots (red=high, amber=medium, green=low)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pnpm: command not found` | Run: `npm install -g pnpm` |
| Blank page / no data | Make sure backend is running on port 8000 |
| "Failed to fetch" errors | Check backend terminal for errors |
| Chat not working | Verify `OPENAI_API_KEY` is set in `backend/.env` |
| Page not found (404) | Make sure you're going to `/tasks`, `/chat`, or `/calendar` |

## Stop the Frontend

Press `Ctrl+C` in the terminal running the dev server.

---

Proceed to Step 5 (Microservices) for the full event-driven system.
