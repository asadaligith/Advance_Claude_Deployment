"use client";

import type { TaskPriority } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  low: {
    label: "Low",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
  },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
