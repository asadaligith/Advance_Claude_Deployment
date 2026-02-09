# UI Overhaul Plan: shadcn/ui + Tailwind v4

## Overview
Full visual overhaul of the existing Next.js 15 frontend using shadcn/ui component library. All existing functionality is preserved — this is a CSS/component-level rewrite, not a logic rewrite.

## Current State
- 4 pages: `/` (placeholder), `/(dashboard)/` (tasks), `/chat`, `/calendar`
- 11 components: all functional with raw Tailwind classes
- No icons, no design system, no loading skeletons, no toast feedback
- No login flow (UUID must be manually set in localStorage)

## Target State
- Professional, modern UI with shadcn/ui components
- Lucide icons throughout (sidebar, buttons, badges)
- Loading skeletons on all data-fetching views
- Toast notifications for create/complete/delete actions
- Responsive design (mobile-friendly sidebar)
- Proper auth page with UUID input form
- Dark mode support via CSS variables

---

## Step 1: Install & Configure shadcn/ui (new files only)

**Commands:**
```bash
cd frontend
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add -D @tailwindcss/animate
npx shadcn@latest init
```

**New files created:**
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/components/ui/` — shadcn component directory

**Modified files:**
- `src/app/globals.css` — Add CSS variables for shadcn theme (light + dark)

**shadcn/ui components to install:**
```bash
npx shadcn@latest add button card input textarea select badge
npx shadcn@latest add dialog sheet label checkbox separator
npx shadcn@latest add skeleton avatar scroll-area tooltip
npx shadcn@latest add dropdown-menu popover calendar sonner
npx shadcn@latest add tabs toggle-group
```

This creates ~18 files in `src/components/ui/`.

---

## Step 2: Update Root Layout + globals.css

**File: `src/app/globals.css`**
- Add CSS custom properties for shadcn theming (--background, --foreground, --primary, etc.)
- Add dark mode variables
- Add base styles for body

**File: `src/app/layout.tsx`**
- Add `<Toaster />` from sonner for toast notifications
- Add `className` with font and theme variables to body

---

## Step 3: Create Auth/Landing Page

**File: `src/app/page.tsx`** (rewrite)
- Hero section: app name, tagline, feature highlights
- UUID input form with Card component
- "Get Started" button → saves UUID to localStorage → redirects to dashboard
- Uses: Card, Input, Button, Label

---

## Step 4: Redesign Dashboard Layout (Sidebar)

**File: `src/app/(dashboard)/layout.tsx`** (rewrite)
- Sidebar with lucide icons: `LayoutDashboard`, `MessageSquare`, `Calendar`
- App branding at top with `CheckSquare` icon
- User ID display at bottom with `LogOut` button
- Mobile responsive: hamburger menu on small screens
- Active nav item with accent background
- Uses: Button, Separator, Tooltip, Avatar

---

## Step 5: Redesign Dashboard Page

**File: `src/app/(dashboard)/page.tsx`** (rewrite)
- Stat cards using shadcn `Card` with icons (ClipboardList, Clock, CheckCircle, AlertTriangle, Flame)
- Quick filter buttons using `Button` variant="outline" with active state
- Task form moved into collapsible section or Sheet (slide-in panel)
- Search bar with Search icon prefix
- Better empty state with illustration text
- Loading skeleton grid for stats + task list
- Uses: Card, Button, Skeleton, Sheet, Badge, Tabs

---

## Step 6: Redesign Task Components

**File: `src/components/tasks/task-card.tsx`** (rewrite)
- Card component with hover shadow
- Priority badge using shadcn Badge with variant colors
- Tag badges using Badge variant="secondary"
- Action buttons in DropdownMenu (three-dot menu): Complete/Reopen, Delete
- Overdue state with destructive card border
- Completion history in collapsible section
- Uses: Card, Badge, Button, DropdownMenu, Separator

**File: `src/components/tasks/task-list.tsx`** (minor update)
- Use ScrollArea for the list
- Better empty state with inbox icon

**File: `src/components/tasks/priority-badge.tsx`** (rewrite)
- Use shadcn Badge with custom variant styles
- Add small dot indicator before text

**File: `src/components/tasks/task-form.tsx`** (rewrite)
- Use shadcn Input, Textarea, Select, Label, Checkbox, Button
- Proper form layout with labeled sections
- Tag input integrated as TagInput component
- Recurrence section with Toggle/Switch
- Calendar popover for due date instead of native datetime-local
- Uses: Input, Textarea, Label, Button, Select, Checkbox, Popover, Calendar

**File: `src/components/tasks/search-bar.tsx`** (rewrite)
- Input with Search icon prefix (inside the input)
- Clear button (X icon) when query is non-empty
- Uses: Input, Button

**File: `src/components/tasks/filter-panel.tsx`** (rewrite)
- Horizontal row of Select components with labels
- Sort toggle using Button with ArrowUpDown icon
- Date range with Calendar popovers
- "Clear filters" button
- Uses: Select, Button, Popover, Calendar, Separator

**File: `src/components/tasks/tag-input.tsx`** (minor update)
- Style tag pills using Badge component
- Style suggestions dropdown with shadcn Popover styling

---

## Step 7: Redesign Chat Page

**File: `src/app/(dashboard)/chat/page.tsx`** (minor update)
- Better header with MessageSquare icon
- Full-height layout

**File: `src/components/chat/chat-panel.tsx`** (rewrite)
- Input with Send icon button
- Loading state with animated dots
- New conversation button
- Uses: Input, Button, ScrollArea

**File: `src/components/chat/message-list.tsx`** (rewrite)
- User messages with Avatar (user icon)
- Assistant messages with Avatar (bot icon)
- Proper bubble styling with rounded corners
- Auto-scroll to bottom
- Empty state: "Start a conversation" prompt
- Uses: Avatar, ScrollArea, Card

---

## Step 8: Redesign Calendar Page

**File: `src/app/(dashboard)/calendar/page.tsx`** (rewrite)
- Month navigation with ChevronLeft/ChevronRight icon buttons
- "Today" quick-nav button
- Better day cells with Card-like styling
- Task indicators using Badge colors
- Today highlight with primary ring
- Uses: Button, Badge, Card

---

## File Summary

| Action | Count | Files |
|--------|-------|-------|
| New (shadcn/ui components) | ~18 | `src/components/ui/*.tsx` |
| New (utility) | 1 | `src/lib/utils.ts` |
| Rewrite | 12 | All pages + all task/chat components |
| Unchanged | 3 | `types.ts`, `api-client.ts`, `auth.ts` |

**Total: ~19 new files, 12 modified files, 3 unchanged files**

---

## Execution Order (dependency-based)

1. **Step 1**: Install dependencies + shadcn init → creates `ui/` components
2. **Step 2**: globals.css + root layout → theme + toaster available
3. **Step 3**: Landing page → auth flow works
4. **Step 4**: Dashboard layout → sidebar available for all pages
5. **Step 5**: Dashboard page → main view redesigned
6. **Step 6**: Task components → cards, forms, filters polished
7. **Step 7**: Chat components → chat redesigned
8. **Step 8**: Calendar page → calendar redesigned

Each step builds on the previous. Steps 5-8 can be done in any order after Step 4.

---

## Non-Goals
- No backend changes
- No new API endpoints
- No new features (just visual overhaul)
- No Better Auth integration (keep UUID approach for Phase 5)
- No server components conversion (keep client components)
