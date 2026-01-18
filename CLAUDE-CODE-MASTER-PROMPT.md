# MLV Internal Platform - Complete Build Prompt for Claude Code

## 🎯 Project Overview

Transform the existing MLV Intern Portal into a full-featured, multi-tenant internal platform similar to Notion/Linear. This will be MLV's central hub for managing teams, tracking progress, and facilitating collaboration across all programs.

**IMPORTANT:** This is a complete rebuild with Supabase integration. The existing code should be used as reference for UI patterns but the data layer and authentication will be completely new.

---

## 📁 Project Location

```
~/Desktop/MLV/MLV-PMA-Internship
```

**Current Branch:** `claude/build-mlv-intern-portal-1vw8o`

---

## 🔑 Environment Variables (Already Configured)

The `.env.local` file is already set up with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lqjisteahvxakzfjuisr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxamlzdGVhaHZ4YWt6Zmp1aXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODc5MDAsImV4cCI6MjA4NDI2MzkwMH0.oZmxYn8owHJzIgvHTA1vXyvLfLUoZlXnRfTlZVTAbf8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxamlzdGVhaHZ4YWt6Zmp1aXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODY4NzkwMCwiZXhwIjoyMDg0MjYzOTAwfQ.38FY8Sect_sbVRT5Zkt-_mzouscbPGvuU78Jt8EexLA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Database Schema (Already Created in Supabase)

The following tables already exist in the Supabase database with Row Level Security (RLS) policies:

### Core Tables

```sql
-- organizations: Top-level company (MLV)
-- id, name, slug, logo_url, description, created_at, updated_at

-- profiles: User profiles (auto-created on signup via trigger)
-- id (references auth.users), email, full_name, avatar_url, timezone, created_at, updated_at

-- org_memberships: User ↔ Organization relationship
-- id, user_id, org_id, role ('owner'|'admin'|'member'), created_at

-- teams: Teams within organization
-- id, org_id, name, slug, description, color, icon, is_archived, created_at, updated_at

-- team_memberships: User ↔ Team relationship
-- id, user_id, team_id, role ('admin'|'member'), joined_at

-- sprints: Time-boxed periods
-- id, team_id, name, description, start_date, end_date, is_active, created_at

-- submissions: Weekly check-ins
-- id, user_id, team_id, sprint_id, goals, deliverables, blockers, reflection, mood, hours_worked, submitted_at, updated_at

-- high_fives: Peer recognition
-- id, from_user_id, to_user_id, team_id, sprint_id, message, category, created_at

-- tasks: Kanban board tasks
-- id, team_id, sprint_id, title, description, status ('todo'|'in_progress'|'review'|'done'), priority, assignee_id, created_by_id, due_date, estimated_hours, actual_hours, position, parent_task_id, created_at, updated_at

-- task_comments: Comments on tasks
-- id, task_id, user_id, content, created_at

-- coffee_chats: Random pairing
-- id, team_id, sprint_id, user_1_id, user_2_id, status, scheduled_at, completed_at, notes, created_at

-- one_on_ones: 1:1 meeting prep
-- id, user_id, team_id, sprint_id, manager_id, scheduled_at, proud_of, need_help, questions, prep_submitted_at, manager_notes, action_items, meeting_completed_at, created_at, updated_at

-- invitations: Pending invites
-- id, email, org_id, team_id, role, invited_by, token, expires_at, accepted_at, created_at

-- activity_log: Audit trail
-- id, org_id, team_id, user_id, action, entity_type, entity_id, metadata (JSONB), created_at
```

### Seed Data Already Present

```
Organization: MLV (Makers Lab Ventures) - slug: 'mlv'
Teams:
  - PMA Internship 2026 (slug: 'pma-internship-2026')
  - Sprint HK - Jan 2026 (slug: 'sprint-hk-jan-2026')
  - Sprint HCM - Jan 2026 (slug: 'sprint-hcm-jan-2026')
Sprints:
  - Sprint 1 - Onboarding (Jan 16-23, 2026) - ACTIVE
  - Sprint 2 - Discovery (Jan 23-30, 2026)
```

---

## 🔐 Authentication Configuration

**Google OAuth is fully configured in Supabase.**

- Users sign in with Google
- Profile is auto-created via database trigger on first sign-in
- After sign-in, check org_memberships to determine access
- First-time users (Tim/Dylan) need to be manually added as org owners

### Auth Flow

1. User visits `/login`
2. Clicks "Sign in with Google"
3. Supabase handles OAuth flow → redirects to `/auth/callback`
4. Callback page checks if user has org memberships
5. If yes → redirect to `/[org]/[default-team]`
6. If no → show "No access" or "Accept invitation" page

---

## 🎨 Design System

### Brand Colors
```css
:root {
  --brand-green: #6AC670;
  --brand-yellow: #F2C94C;
  --bg-dark: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-card-hover: #252525;
  --border: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
}
```

### Design Principles
- Dark theme (match existing design)
- Clean, minimal UI inspired by Linear/Notion
- Responsive (mobile-first)
- Smooth animations with Framer Motion
- Accessible (WCAG AA)

### Typography
- Font: Inter (already in use)
- Headings: Semi-bold
- Body: Regular
- Use proper hierarchy (h1 → h6)

---

## 📂 Target File Structure

```
app/
├── (marketing)/
│   ├── page.tsx                    # Public landing (redirect to login for now)
│   └── layout.tsx
│
├── (auth)/
│   ├── login/page.tsx              # Login page with Google OAuth button
│   ├── auth/callback/route.ts      # OAuth callback handler
│   └── layout.tsx
│
├── (dashboard)/
│   ├── layout.tsx                  # Main app layout (sidebar, header)
│   │
│   └── [org]/                      # Dynamic org routes (e.g., /mlv)
│       ├── layout.tsx              # Org-level layout
│       ├── page.tsx                # Redirect to default team or dashboard
│       │
│       ├── dashboard/
│       │   └── page.tsx            # Org overview (admin only)
│       │
│       ├── teams/
│       │   └── page.tsx            # List all teams in org
│       │
│       ├── members/
│       │   └── page.tsx            # Org member management
│       │
│       ├── settings/
│       │   └── page.tsx            # Org settings
│       │
│       └── [team]/                 # Dynamic team routes (e.g., /mlv/pma-internship-2026)
│           ├── layout.tsx          # Team-level layout
│           ├── page.tsx            # Team home/dashboard
│           │
│           ├── submit/
│           │   └── page.tsx        # Weekly submission form
│           │
│           ├── board/
│           │   └── page.tsx        # Kanban task board
│           │
│           ├── recognition/
│           │   └── page.tsx        # High fives / kudos
│           │
│           ├── one-on-one/
│           │   └── page.tsx        # 1:1 prep form
│           │
│           ├── coffee-chats/
│           │   └── page.tsx        # Coffee chat pairings
│           │
│           ├── members/
│           │   └── page.tsx        # Team members list
│           │
│           └── settings/
│               └── page.tsx        # Team settings (admin only)
│
├── api/
│   └── auth/
│       └── callback/route.ts       # Supabase auth callback
│
lib/
├── supabase/
│   ├── client.ts                   # Browser Supabase client
│   ├── server.ts                   # Server Supabase client
│   ├── middleware.ts               # Auth middleware helpers
│   └── admin.ts                    # Service role client (server only)
│
├── hooks/
│   ├── useUser.ts                  # Current authenticated user
│   ├── useOrg.ts                   # Current organization context
│   ├── useTeam.ts                  # Current team context
│   ├── usePermissions.ts           # Permission checking hooks
│   ├── useSubmissions.ts           # Submissions CRUD
│   ├── useTasks.ts                 # Tasks CRUD
│   ├── useHighFives.ts             # High fives CRUD
│   └── useMembers.ts               # Members management
│
├── types/
│   ├── database.ts                 # Database types (generate with Supabase CLI)
│   └── index.ts                    # Shared types
│
├── utils/
│   ├── permissions.ts              # Permission helper functions
│   └── constants.ts                # App constants
│
components/
├── providers/
│   ├── AuthProvider.tsx            # Auth context provider
│   ├── OrgProvider.tsx             # Organization context
│   └── TeamProvider.tsx            # Team context
│
├── auth/
│   ├── LoginForm.tsx               # Google OAuth login button
│   ├── LogoutButton.tsx            # Logout functionality
│   └── UserMenu.tsx                # User dropdown menu
│
├── layout/
│   ├── Sidebar.tsx                 # Main navigation sidebar
│   ├── Header.tsx                  # Top header bar
│   ├── OrgSwitcher.tsx             # Switch between organizations
│   ├── TeamSwitcher.tsx            # Switch between teams
│   └── MobileNav.tsx               # Mobile navigation
│
├── dashboard/
│   ├── OrgOverview.tsx             # Org-level stats dashboard
│   ├── TeamOverview.tsx            # Team-level stats
│   ├── SprintProgress.tsx          # Sprint progress indicator
│   └── ActivityFeed.tsx            # Recent activity stream
│
├── submissions/
│   ├── SubmissionForm.tsx          # Weekly check-in form
│   ├── SubmissionCard.tsx          # Display single submission
│   ├── SubmissionList.tsx          # List of submissions
│   └── SubmissionStatus.tsx        # Submission status badge
│
├── tasks/
│   ├── KanbanBoard.tsx             # Drag-and-drop kanban
│   ├── KanbanColumn.tsx            # Single column
│   ├── TaskCard.tsx                # Task card component
│   ├── TaskModal.tsx               # Task detail/edit modal
│   ├── TaskForm.tsx                # Create/edit task form
│   └── TaskComments.tsx            # Task comments section
│
├── recognition/
│   ├── HighFiveForm.tsx            # Give a high five form
│   ├── HighFiveCard.tsx            # Display high five
│   ├── HighFiveList.tsx            # List of high fives
│   └── RecognitionWall.tsx         # Recognition display wall
│
├── one-on-one/
│   ├── OneOnOneForm.tsx            # 1:1 prep form
│   ├── OneOnOneCard.tsx            # Display 1:1 record
│   └── OneOnOneHistory.tsx         # History of 1:1s
│
├── members/
│   ├── MemberList.tsx              # List of members
│   ├── MemberCard.tsx              # Member display card
│   ├── MemberAvatar.tsx            # Avatar component
│   └── InviteModal.tsx             # Invite new member modal
│
├── coffee-chats/
│   ├── CoffeeChatCard.tsx          # Coffee chat pairing card
│   ├── CoffeeChatList.tsx          # List of pairings
│   └── ScheduleChat.tsx            # Schedule a chat
│
└── ui/                             # Reusable UI components
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── Textarea.tsx
    ├── Select.tsx
    ├── Modal.tsx
    ├── Dialog.tsx
    ├── Avatar.tsx
    ├── Badge.tsx
    ├── Spinner.tsx
    ├── Skeleton.tsx
    ├── Tabs.tsx
    ├── Dropdown.tsx
    ├── Toast.tsx
    └── EmptyState.tsx

middleware.ts                       # Next.js middleware for auth protection
```

---

## 🔧 Implementation Guide

### Phase 1: Core Setup (Do This First)

#### 1.1 Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install framer-motion
npm install lucide-react
npm install date-fns
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities  # For kanban
npm install sonner  # For toast notifications
```

#### 1.2 Create Supabase Clients

**lib/supabase/client.ts** (Browser client)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**lib/supabase/server.ts** (Server client)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

**lib/supabase/admin.ts** (Service role - server only)
```typescript
import { createClient } from '@supabase/supabase-js'

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

#### 1.3 Create Middleware

**middleware.ts**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/mlv') || 
      request.nextUrl.pathname.match(/^\/[a-z0-9-]+\//)) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/mlv', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### 1.4 Create Auth Callback Route

**app/auth/callback/route.ts**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/mlv'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user has org membership
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: memberships } = await supabase
          .from('org_memberships')
          .select('org_id, organizations(slug)')
          .eq('user_id', user.id)
          .limit(1)
          .single()

        if (memberships) {
          // User has access, redirect to their org
          return NextResponse.redirect(`${origin}/${memberships.organizations.slug}`)
        } else {
          // No membership - redirect to no-access page
          return NextResponse.redirect(`${origin}/no-access`)
        }
      }
    }
  }

  // Error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
```

#### 1.5 Create Login Page

**app/(auth)/login/page.tsx**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Image
            src="/MLV Logo (white).png"
            alt="MLV"
            width={120}
            height={40}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome to MLV
          </h1>
          <p className="text-gray-400">
            Sign in to access the internal platform
          </p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3 py-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Only MLV team members can access this platform
        </p>
      </div>
    </div>
  )
}
```

### Phase 2: Core Providers & Layout

#### 2.1 Auth Provider

**components/providers/AuthProvider.tsx**
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

#### 2.2 Dashboard Layout with Sidebar

**app/(dashboard)/layout.tsx**
```typescript
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
```

### Phase 3: Key Features to Build

#### 3.1 Sidebar Navigation

The sidebar should include:
- MLV logo at top
- Team switcher dropdown
- Navigation links:
  - Home (team dashboard)
  - Submit (weekly check-in)
  - Board (kanban tasks)
  - Recognition (high fives)
  - 1:1 Prep
  - Coffee Chats
  - Members
- Admin section (if user is admin):
  - Team Settings
  - Org Dashboard (if org admin)
- User menu at bottom with avatar and logout

#### 3.2 Team Dashboard (`/[org]/[team]/page.tsx`)

Display:
- Current sprint info (name, dates, progress)
- Submission status for current sprint
- Quick stats (tasks completed, high fives given/received)
- Recent activity feed
- Quick actions (Submit update, Create task, Give high five)

#### 3.3 Weekly Submission Form (`/[org]/[team]/submit/page.tsx`)

Form fields:
- Goals for the week (textarea)
- Deliverables completed (textarea)
- Blockers/challenges (textarea)
- Reflection (textarea)
- Mood rating (1-5 emoji scale)
- Hours worked (number input)

Check if user already submitted for current sprint and show their submission for editing.

#### 3.4 Kanban Board (`/[org]/[team]/board/page.tsx`)

- Four columns: To Do, In Progress, Review, Done
- Drag and drop between columns
- Click to open task detail modal
- Create new task button
- Filter by assignee, priority
- Show task count per column

#### 3.5 High Fives (`/[org]/[team]/recognition/page.tsx`)

- Form to give a high five (select recipient, message, category)
- Wall/feed of recent high fives
- Categories: Teamwork, Innovation, Leadership, Helpfulness, Excellence
- Celebration animation when sending

#### 3.6 1:1 Prep (`/[org]/[team]/one-on-one/page.tsx`)

For team members:
- Form to prep for 1:1 with manager
- Fields: What I'm proud of, Where I need help, Questions I have

For managers/admins:
- View all team member 1:1 preps
- Add manager notes and action items
- Mark meeting as complete

---

## 🎯 Key Implementation Notes

### Data Fetching Pattern

Use Server Components for initial data fetch, Client Components for interactivity:

```typescript
// Server Component (page.tsx)
import { createClient } from '@/lib/supabase/server'

export default async function TeamPage({ params }) {
  const supabase = await createClient()
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', params.team)
    .single()
  
  return <TeamDashboard team={team} />
}
```

### Permission Checking

Always verify permissions before showing admin features:

```typescript
// Check if user is team admin
const { data: membership } = await supabase
  .from('team_memberships')
  .select('role')
  .eq('user_id', user.id)
  .eq('team_id', teamId)
  .single()

const isTeamAdmin = membership?.role === 'admin'

// Check if user is org admin
const { data: orgMembership } = await supabase
  .from('org_memberships')
  .select('role')
  .eq('user_id', user.id)
  .eq('org_id', orgId)
  .single()

const isOrgAdmin = ['owner', 'admin'].includes(orgMembership?.role)
```

### Real-time Updates (Optional Enhancement)

Use Supabase realtime for live updates:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('high_fives')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'high_fives',
      filter: `team_id=eq.${teamId}`
    }, (payload) => {
      // Add new high five to list
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [teamId])
```

---

## 🚀 First-Time Setup After Building

After the platform is built, Tim and Dylan need to be added as org owners:

1. Sign in with Google (creates profile automatically)
2. Go to Supabase SQL Editor and run:

```sql
-- Find your user ID
SELECT id, email, full_name FROM profiles ORDER BY created_at DESC;

-- Add Tim as org owner (replace with actual UUID)
INSERT INTO org_memberships (user_id, org_id, role)
VALUES ('YOUR-USER-ID-HERE', 'a0000000-0000-0000-0000-000000000001', 'owner');

-- Add to PMA Internship team as admin
INSERT INTO team_memberships (user_id, team_id, role)
VALUES ('YOUR-USER-ID-HERE', 'b0000000-0000-0000-0000-000000000001', 'admin');
```

---

## ✅ Success Criteria

1. **Authentication** - Google OAuth works, users can sign in/out
2. **Authorization** - Users only see orgs/teams they belong to
3. **Navigation** - Sidebar works, team/org switching works
4. **Submissions** - Users can submit weekly updates
5. **Kanban** - Drag-and-drop task board works
6. **High Fives** - Users can send and view recognition
7. **1:1 Prep** - Team members can prep, managers can view/add notes
8. **Mobile** - Responsive design works on phones
9. **Performance** - Fast page loads, smooth animations

---

## 🎬 Start Building!

Begin with Phase 1 (Core Setup), then Phase 2 (Providers & Layout), then build features one by one. Test each feature before moving to the next.

Priority order for features:
1. Login/Auth flow
2. Dashboard layout with sidebar
3. Team dashboard page
4. Weekly submission form
5. Kanban board
6. High fives
7. 1:1 prep
8. Coffee chats
9. Member management
10. Invite system

Good luck! 🚀
