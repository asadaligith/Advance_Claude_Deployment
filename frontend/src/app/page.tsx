"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserId, getUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckSquare,
  MessageSquare,
  Calendar,
  Repeat,
  Bell,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";

const features = [
  { icon: Sparkles, title: "AI Chat", desc: "Manage tasks with natural language" },
  { icon: CheckSquare, title: "Smart Tasks", desc: "Priority, tags, and due dates" },
  { icon: Repeat, title: "Recurring", desc: "Auto-create repeating tasks" },
  { icon: Bell, title: "Reminders", desc: "Never miss a deadline" },
  { icon: Calendar, title: "Calendar", desc: "Visualize your schedule" },
  { icon: MessageSquare, title: "Chat History", desc: "Conversation-based workflow" },
];

export default function HomePage() {
  const [userId, setUserIdInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const existing = getUserId();
    if (existing) {
      router.replace("/tasks");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = userId.trim();

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmed)) {
      setError("Please enter a valid UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)");
      return;
    }

    setUserId(trimmed);
    router.push("/tasks");
  }

  function handleGenerateUUID() {
    const uuid = crypto.randomUUID();
    setUserIdInput(uuid);
    setError("");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        {/* Hero */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckSquare className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Todo Chatbot</h1>
          <p className="text-muted-foreground">
            AI-powered task management for cloud-native teams
          </p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
            <CardDescription>
              Enter your user ID to access your tasks. In Phase 5, any valid UUID works as your identity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID (UUID)</Label>
                <Input
                  id="userId"
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                  value={userId}
                  onChange={(e) => {
                    setUserIdInput(e.target.value);
                    setError("");
                  }}
                  className={error ? "border-destructive" : ""}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Sign In
                </Button>
                <Button type="button" variant="outline" onClick={handleGenerateUUID}>
                  Generate UUID
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-card p-3 text-center"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">{title}</span>
              <span className="text-[10px] text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
