"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col lg:h-[calc(100vh-1.5rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage your tasks using natural language</p>
      </div>
      <Card className="flex-1 overflow-hidden">
        <ChatPanel />
      </Card>
    </div>
  );
}
