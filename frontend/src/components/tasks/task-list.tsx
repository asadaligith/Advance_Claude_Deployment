"use client";

import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Inbox } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onComplete?: (taskId: number) => void;
  onReopen?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskList({ tasks, onComplete, onReopen, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Inbox className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium">No tasks found</p>
        <p className="text-xs">Create a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onReopen={onReopen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
