"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
        <MessageSquare className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium">Start a conversation</p>
        <p className="text-xs">Ask me to create, update, or manage your tasks</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <div
            key={i}
            className={cn("flex gap-3", isUser && "flex-row-reverse")}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={cn(
                "text-xs",
                isUser ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5",
                isUser
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
