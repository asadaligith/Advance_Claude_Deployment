"use client";

import { useCallback, useEffect, useState } from "react";
import { listTasks } from "@/lib/api-client";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      const result = await listTasks({
        due_from: startDate,
        due_to: endDate,
        page_size: 100,
      });
      setTasks(result.tasks);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function getTasksForDay(day: number): Task[] {
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          </div>
          <p className="text-sm text-muted-foreground">View tasks by due date</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center text-sm font-medium">{monthName}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <Skeleton className="h-[500px] rounded-xl" />
      ) : (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="border-b border-border bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/20 p-1.5" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-[100px] border-b border-r border-border p-1.5 transition-colors hover:bg-accent/50",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday && "bg-primary text-primary-foreground"
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-1 rounded px-1 py-0.5"
                      >
                        <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", PRIORITY_DOT[t.priority])} />
                        <span className="truncate text-[11px]">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <Badge variant="secondary" className="text-[9px] h-4">
                        +{dayTasks.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
