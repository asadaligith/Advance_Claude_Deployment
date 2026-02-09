"use client";

import type { TaskFilters, TaskPriority, TaskStatus } from "@/lib/types";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const hasFilters = filters.status || filters.priority || filters.due_from || filters.due_to;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={filters.status ?? ""}
          onChange={(e) =>
            onChange({ ...filters, status: (e.target.value as TaskStatus) || undefined })
          }
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select
          value={filters.priority ?? ""}
          onChange={(e) =>
            onChange({ ...filters, priority: (e.target.value as TaskPriority) || undefined })
          }
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Sort by</Label>
        <Select
          value={filters.sort_by ?? "created_at"}
          onChange={(e) =>
            onChange({ ...filters, sort_by: e.target.value as TaskFilters["sort_by"] })
          }
        >
          <option value="created_at">Created</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1"
        onClick={() =>
          onChange({ ...filters, sort_order: filters.sort_order === "asc" ? "desc" : "asc" })
        }
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
        {filters.sort_order === "asc" ? "Asc" : "Desc"}
      </Button>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">From</Label>
        <Input
          type="date"
          value={filters.due_from ?? ""}
          onChange={(e) => onChange({ ...filters, due_from: e.target.value || undefined })}
          className="w-[140px]"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">To</Label>
        <Input
          type="date"
          value={filters.due_to ?? ""}
          onChange={(e) => onChange({ ...filters, due_to: e.target.value || undefined })}
          className="w-[140px]"
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 text-muted-foreground"
          onClick={() => onChange({ sort_by: "created_at", sort_order: "desc" })}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
