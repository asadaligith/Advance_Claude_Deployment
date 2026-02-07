"use client";

import { useCallback, useEffect, useState } from "react";
import {
  completeTask,
  createTask,
  deleteTask,
  listTasks,
  reopenTask,
} from "@/lib/api-client";
import { FilterPanel } from "@/components/tasks/filter-panel";
import { SearchBar } from "@/components/tasks/search-bar";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import type { Task, TaskCreateInput, TaskFilters } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const result = await listTasks(filters);
      setTasks(result.tasks);
      setTotal(result.total);
    } catch {
      // User may not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearch = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, q: q || undefined }));
  }, []);

  async function handleCreate(data: TaskCreateInput) {
    setFormLoading(true);
    try {
      await createTask(data);
      await fetchTasks();
    } finally {
      setFormLoading(false);
    }
  }

  async function handleComplete(taskId: number) {
    await completeTask(taskId);
    await fetchTasks();
  }

  async function handleReopen(taskId: number) {
    await reopenTask(taskId);
    await fetchTasks();
  }

  async function handleDelete(taskId: number) {
    await deleteTask(taskId);
    await fetchTasks();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <p className="text-sm text-gray-500">{total} total tasks</p>
      </div>

      <TaskForm onSubmit={handleCreate} loading={formLoading} />

      {/* Search */}
      <div className="mt-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filters */}
      <div className="mt-3">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {/* Task List */}
      <div className="mt-4">
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            Loading tasks...
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
