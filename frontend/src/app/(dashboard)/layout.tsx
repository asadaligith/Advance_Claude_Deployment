"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId, clearAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckSquare,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const id = getUserId();
    if (!id) {
      router.replace("/");
      return;
    }
    setUserId(id);
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.replace("/");
  }

  if (!userId) return null;

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Todo Chatbot</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* User info */}
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium">{userId.slice(0, 8)}...</p>
              <p className="text-[10px] text-muted-foreground">Phase 5 User</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-2 border-b border-border px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold">Todo Chatbot</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
