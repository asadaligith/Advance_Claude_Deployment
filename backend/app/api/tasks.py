"""Task CRUD routes per contracts/backend-api.md."""

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select

from app.api.deps import get_current_user_id, get_db
from app.models.completion import CompletionRecord
from app.models.task import Task, TaskCreate, TaskPriority, TaskRead, TaskStatus, TaskUpdate
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", status_code=201, response_model=TaskRead)
async def create_task(
    data: TaskCreate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await task_service.create_task(db, user_id, data)


@router.get("")
async def list_tasks(
    q: str | None = Query(None),
    status: TaskStatus | None = Query(None),
    priority: TaskPriority | None = Query(None),
    tags: list[str] | None = Query(None),
    due_from: datetime | None = Query(None),
    due_to: datetime | None = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await task_service.list_tasks(
        db,
        user_id,
        status=status,
        priority=priority,
        tag_names=tags,
        due_from=due_from,
        due_to=due_to,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
        q=q,
    )


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    task = await task_service.get_task(db, user_id, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    data: TaskUpdate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    task = await task_service.update_task(db, user_id, task_id, data)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/{task_id}/complete", response_model=TaskRead)
async def complete_task(
    task_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await task_service.complete_task(db, user_id, task_id)
    if result is None:
        # Distinguish between not found and already completed
        existing = await task_service.get_task(db, user_id, task_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Task not found")
        raise HTTPException(status_code=409, detail="Task already completed")
    return result


@router.post("/{task_id}/reopen", response_model=TaskRead)
async def reopen_task(
    task_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await task_service.reopen_task(db, user_id, task_id)
    if result is None:
        existing = await task_service.get_task(db, user_id, task_id)
        if existing is None:
            raise HTTPException(status_code=404, detail="Task not found")
        raise HTTPException(status_code=409, detail="Task is not completed")
    return result


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    deleted = await task_service.delete_task(db, user_id, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")


@router.get("/{task_id}/completions")
async def get_completions(
    task_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get completion history for a recurring task."""
    # Verify task ownership
    task = (
        await db.execute(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
    ).scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    records = (
        await db.execute(
            select(CompletionRecord)
            .where(CompletionRecord.task_id == task_id)
            .order_by(CompletionRecord.completed_at.desc())
        )
    ).scalars().all()

    return {
        "completions": [
            {
                "id": r.id,
                "completed_at": r.completed_at.isoformat(),
                "completed_by": str(r.completed_by),
            }
            for r in records
        ]
    }
