"""FastAPI application entry point with Dapr subscription endpoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.health import router as health_router
from app.api.tags import router as tags_router
from app.api.tasks import router as tasks_router

app = FastAPI(
    title="Todo Chatbot API",
    version="0.1.0",
    description="Event-driven todo chatbot backend with Dapr integration",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoints (no prefix)
app.include_router(health_router)

# API routers
app.include_router(tasks_router)
app.include_router(tags_router)
app.include_router(chat_router)


@app.get("/dapr/subscribe")
async def dapr_subscribe():
    """Dapr programmatic subscription declaration.

    Dapr calls this endpoint on startup to discover topic subscriptions.
    The backend API does not consume events — it only publishes.
    Consumer services (recurring-task, notification) declare their own
    subscriptions.
    """
    return []
