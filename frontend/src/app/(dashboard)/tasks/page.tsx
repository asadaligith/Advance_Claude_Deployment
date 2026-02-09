"use client";

import { useCallback, useEffect, useState } from "react";
import {
  completeTask,
  createTask,
  deleteTask,
  getDashboardStats,
  listTasks,
  reopenTask,
  type DashboardStats,
} from "@/lib/api-client";
import { FilterPanel } from "@/components/tasks/filter-panel";
import { SearchBar } from "@/components/tasks/search-bar";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Task, TaskCreateInput, TaskFilters } from "@/lib/types";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";

const STAT_CARDS = [
  { key: "total", label: "Total", icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { key: "overdue", label: "Overdue", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  { key: "high_priority", label: "High Priority", icon: Flame, color: "text-orange-600 bg-orange-50" },
] as const;

const QUICK_FILTERS = [
  { key: "all", label: "All Tasks" },
  { key: "today", label: "Due Today" },
  { key: "week", label: "This Week" },
  { key: "high", label: "High Priority" },
] as const;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [filters, setFilters] = useState<TaskFilters>({
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [taskResult, statsResult] = await Promise.all([
        listTasks(filters),
        getDashboardStats(),
      ]);
      setTasks(taskResult.tasks);
      setTotal(taskResult.total);
      setStats(statsResult);
    } catch {
      // User may not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSearch = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, q: q || undefined }));
  }, []);

  async function handleCreate(data: TaskCreateInput) {
    setFormLoading(true);
    try {
      await createTask(data);
      await fetchAll();
    } finally {
      setFormLoading(false);
    }
  }

  async function handleComplete(taskId: number) {
    await completeTask(taskId);
    await fetchAll();
  }

  async function handleReopen(taskId: number) {
    await reopenTask(taskId);
    await fetchAll();
  }

  async function handleDelete(taskId: number) {
    await deleteTask(taskId);
    await fetchAll();
  }

  function applyQuickFilter(preset: string) {
    setActiveQuickFilter(preset);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    switch (preset) {
      case "today": {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFilters((prev) => ({
          ...prev,
          due_from: todayStr,
          due_to: tomorrow.toISOString().split("T")[0],
          status: "pending",
          priority: undefined,
        }));
        break;
      }
      case "week": {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        setFilters((prev) => ({
          ...prev,
          due_from: todayStr,
          due_to: weekEnd.toISOString().split("T")[0],
          status: "pending",
          priority: undefined,
        }));
        break;
      }
      case "high":
        setFilters((prev) => ({
          ...prev,
          priority: "high",
          status: "pending",
          due_from: undefined,
          due_to: undefined,
        }));
        break;
      case "all":
        setFilters({ sort_by: "created_at", sort_order: "desc" });
        break;
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">Manage and track your tasks</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="overflow-hidden">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats[key as keyof DashboardStats]}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Filters */}
      <div className="flex gap-2">
        {QUICK_FILTERS.map(({ key, label }) => (
          <Button
            key={key}
            variant={activeQuickFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => applyQuickFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Task Form */}
      <TaskForm onSubmit={handleCreate} loading={formLoading} />

      {/* Search & Filters */}
      <div className="space-y-3">
        <SearchBar onSearch={handleSearch} />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      <Separator />

      {/* Task List */}
      <div>
        <p className="mb-3 text-sm text-muted-foreground">{total} tasks found</p>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onComplete={handleComplete}
            onReopen={handleReopen}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
