"use client";

import type { Task } from "@/lib/types";
import { PriorityBadge } from "./priority-badge";

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: number) => void;
  onReopen?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskCard({ task, onComplete, onReopen, onDelete }: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const isOverdue =
    !isCompleted && task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      className={`rounded-lg border p-4 ${
        isOverdue
          ? "border-red-300 bg-red-50"
          : isCompleted
            ? "border-gray-200 bg-gray-50 opacity-75"
            : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-medium ${
                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
            {task.is_recurring && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                Recurring
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            {task.due_date && (
              <span className={isOverdue ? "font-medium text-red-500" : ""}>
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            <span>
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="ml-3 flex gap-1">
          {isCompleted ? (
            <button
              onClick={() => onReopen?.(task.id)}
              className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
            >
              Reopen
            </button>
          ) : (
            <button
              onClick={() => onComplete?.(task.id)}
              className="rounded px-2 py-1 text-xs text-green-600 hover:bg-green-50"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onDelete?.(task.id)}
            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
