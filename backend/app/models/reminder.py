"""Reminder entity for scheduled task notifications."""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlmodel import Column, Field, SQLModel


class ReminderStatus(str, enum.Enum):
    PENDING = "pending"
    TRIGGERED = "triggered"
    CANCELLED = "cancelled"


class Reminder(SQLModel, table=True):
    __tablename__ = "reminders"

    id: int | None = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="tasks.id", nullable=False, unique=True)
    user_id: uuid.UUID = Field(nullable=False)
    remind_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    status: ReminderStatus = Field(default=ReminderStatus.PENDING, nullable=False)
    job_name: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
