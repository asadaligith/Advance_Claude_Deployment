# Step 2: Environment Setup

## 2.1 Clone the Repository

```bash
git clone https://github.com/asadaligith/Advance_Claude_Deployment.git
cd Advance_Claude_Deployment
```

## 2.2 Create the .env File

```bash
# Copy the template
cp .env.example .env
```

## 2.3 Edit .env with Your Credentials

Open `.env` in any text editor and fill in your values:

```env
# ============================================
# DATABASE (Required)
# ============================================
# Get this from Neon dashboard → Connection Details → Connection string
# IMPORTANT: Must start with postgresql+asyncpg:// (not postgres://)
DATABASE_URL='postgresql+asyncpg://your-user:your-password@your-host.neon.tech/your-db?sslmode=require'

# Same database but standard format (for Dapr state store)
# IMPORTANT: Must start with postgresql:// (no +asyncpg)
DAPR_DATABASE_URL='postgresql://your-user:your-password@your-host.neon.tech/your-db?sslmode=require'

# ============================================
# OPENAI (Required for AI Chat)
# ============================================
# Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY='sk-your-openai-api-key'

# ============================================
# DAPR (Keep defaults for local dev)
# ============================================
DAPR_HTTP_PORT=3500

# ============================================
# AUTH (Keep defaults for local dev)
# ============================================
BETTER_AUTH_SECRET='any-random-string-here'
BETTER_AUTH_URL=http://localhost:3000

# ============================================
# URLS (Keep defaults for local dev)
# ============================================
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_API_URL=http://localhost:8000
```

## 2.4 Set Up Neon PostgreSQL

1. Go to https://neon.tech and create a free account
2. Click "New Project" → give it a name (e.g., `todo-chatbot`)
3. Go to **Dashboard** → **Connection Details**
4. Copy the connection string
5. Replace the `DATABASE_URL` in your `.env` file:
   - Change `postgres://` to `postgresql+asyncpg://`
   - Keep `?sslmode=require` at the end
6. For `DAPR_DATABASE_URL`, use the same URL but with `postgresql://` (no `+asyncpg`)

### Example

If Neon gives you:
```
postgres://alex:abc123@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Your `.env` should have:
```
DATABASE_URL='postgresql+asyncpg://alex:abc123@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require'
DAPR_DATABASE_URL='postgresql://alex:abc123@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require'
```

## 2.5 Verify .env File

Make sure your `.env` file is in the project root:

```bash
ls .env
# Should show: .env
```

You're ready for Step 3!
