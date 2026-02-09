"use client";

import { useState } from "react";
import type { Task, CompletionRecord } from "@/lib/types";
import { getCompletions } from "@/lib/api-client";
import { PriorityBadge } from "./priority-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  RotateCcw,
  Trash2,
  Clock,
  Repeat,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showHistory, setShowHistory] = useState(false);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  async function toggleHistory() {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    setHistoryLoading(true);
    try {
      const data = await getCompletions(task.id);
      setCompletions(data.completions);
    } catch {
      setCompletions([]);
    } finally {
      setHistoryLoading(false);
      setShowHistory(true);
    }
  }

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isOverdue && "border-destructive/50 bg-destructive/5",
        isCompleted && "opacity-60"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-muted-foreground line-through"
                )}
              >
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
              {task.is_recurring && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Repeat className="h-2.5 w-2.5" />
                  Recurring
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive" className="text-[10px] gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Overdue
                </Badge>
              )}
            </div>

            {task.description && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
              {task.due_date && (
                <span className={cn("flex items-center gap-1", isOverdue && "font-medium text-destructive")}>
                  <CalendarDays className="h-3 w-3" />
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(task.created_at).toLocaleDateString()}
              </span>
              {task.is_recurring && (
                <button
                  onClick={toggleHistory}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  History
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary"
                onClick={() => onReopen?.(task.id)}
                title="Reopen"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600"
                onClick={() => onComplete?.(task.id)}
                title="Complete"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete?.(task.id)}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Completion History */}
        {showHistory && (
          <>
            <Separator className="my-3" />
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium mb-2">Completion History</p>
              {historyLoading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : completions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No completions yet.</p>
              ) : (
                <ul className="space-y-1">
                  {completions.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-emerald-500" />
                      {new Date(c.completed_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
