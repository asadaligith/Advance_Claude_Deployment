"use client";

import { useState } from "react";
import type { TaskCreateInput, TaskPriority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface TaskFormProps {
  onSubmit: (data: TaskCreateInput) => void;
  loading?: boolean;
}

export function TaskForm({ onSubmit, loading }: TaskFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderOffset, setReminderOffset] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [intervalDays, setIntervalDays] = useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let recurrence_pattern = null;
    if (isRecurring) {
      if (recurrenceType === "daily") recurrence_pattern = { type: "daily" as const };
      else if (recurrenceType === "weekly") recurrence_pattern = { type: "weekly" as const, days_of_week: daysOfWeek };
      else if (recurrenceType === "monthly") recurrence_pattern = { type: "monthly" as const, day_of_month: dayOfMonth };
      else recurrence_pattern = { type: "custom" as const, interval_days: intervalDays };
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      tags: tags.length > 0 ? tags : undefined,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      reminder_offset: reminderOffset || null,
      is_recurring: isRecurring || undefined,
      recurrence_pattern,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setTagsInput("");
    setDueDate("");
    setReminderOffset("");
    setIsRecurring(false);
    setRecurrenceType("daily");
    setDaysOfWeek([]);
    setDayOfMonth(1);
    setIntervalDays(2);
    setExpanded(false);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {/* Quick add row */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={loading || !title.trim()} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            {loading ? "Adding..." : "Add"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded fields */}
        {expanded && (
          <>
            <Separator />
            <div className="space-y-3">
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Priority</Label>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Tags (comma-separated)</Label>
                  <Input
                    placeholder="work, urgent"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Due Date</Label>
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Reminder</Label>
                  <Select
                    value={reminderOffset}
                    onChange={(e) => setReminderOffset(e.target.value)}
                    disabled={!dueDate}
                  >
                    <option value="">No reminder</option>
                    <option value="15m">15 min before</option>
                    <option value="30m">30 min before</option>
                    <option value="1h">1 hour before</option>
                    <option value="2h">2 hours before</option>
                    <option value="1d">1 day before</option>
                  </Select>
                </div>
              </div>

              {/* Recurrence */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-input"
                  />
                  Recurring task
                </label>

                {isRecurring && (
                  <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Pattern</Label>
                      <Select
                        value={recurrenceType}
                        onChange={(e) => setRecurrenceType(e.target.value as typeof recurrenceType)}
                        className="w-auto"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </Select>
                    </div>

                    {recurrenceType === "weekly" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Days</Label>
                        <div className="flex gap-1">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant={daysOfWeek.includes(i) ? "default" : "outline"}
                              size="sm"
                              className="h-7 w-7 p-0 text-[10px]"
                              onClick={() =>
                                setDaysOfWeek((prev) =>
                                  prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]
                                )
                              }
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {recurrenceType === "monthly" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Day of month</Label>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          value={dayOfMonth}
                          onChange={(e) => setDayOfMonth(Number(e.target.value))}
                          className="w-16"
                        />
                      </div>
                    )}

                    {recurrenceType === "custom" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Every N days</Label>
                        <Input
                          type="number"
                          min={1}
                          value={intervalDays}
                          onChange={(e) => setIntervalDays(Number(e.target.value))}
                          className="w-16"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </form>
    </Card>
  );
}
