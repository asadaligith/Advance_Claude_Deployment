"use client";

import { useRef, useState } from "react";
import { sendChatMessage } from "@/lib/api-client";
import { MessageList } from "./message-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, RotateCcw } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendChatMessage(text, conversationId);
      setConversationId(result.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewConversation() {
    setMessages([]);
    setConversationId(null);
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      {messages.length > 0 && (
        <>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs text-muted-foreground">
              {conversationId ? `Session: ${conversationId.slice(0, 8)}...` : "New conversation"}
            </span>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handleNewConversation}>
              <RotateCcw className="h-3 w-3" />
              New
            </Button>
          </div>
          <Separator />
        </>
      )}

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <Separator />
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to manage your tasks..."
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
