# MLV Internal Platform - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Next.js 14 + React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   (auth)     │  │ (dashboard)  │  │  (marketing) │          │
│  │  /login      │  │ /[org]/...   │  │  / (public)  │          │
│  │  /signup     │  │ /[org]/[team]│  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    COMPONENTS                           │    │
│  │  Sidebar | Header | TeamSwitcher | Cards | Forms       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    AUTH      │  │   DATABASE   │  │   STORAGE    │          │
│  │              │  │  (Postgres)  │  │   (Files)    │          │
│  │ • Google     │  │              │  │              │          │
│  │ • Magic Link │  │ • RLS        │  │ • Avatars    │          │
│  │ • Sessions   │  │ • Triggers   │  │ • Uploads    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Hosting
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│            interns.mlvignite.com (or new domain)                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Signs In
     │
     ▼
┌─────────────┐     ┌─────────────┐
│  Supabase   │────▶│   Profile   │
│    Auth     │     │   Created   │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    Check Memberships
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        Has Org Access            No Access
              │                         │
              ▼                         ▼
        Load Dashboard           Pending Invite
              │                   or No Access
              ▼
        Fetch Teams (RLS filtered)
              │
              ▼
        Display Data
```

## Permission Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      ORGANIZATION                                │
│                         (MLV)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OWNER ─────────────────────────────────────────────────────▶   │
│  (Tim, Dylan)                                                   │
│  • Full control                                                 │
│  • Manage billing                                               │
│  • Delete org                                                   │
│                                                                  │
│  ADMIN ─────────────────────────────────────────────────────▶   │
│  • Create/manage teams                                          │
│  • Invite users                                                 │
│  • View all data                                                │
│                                                                  │
│  MEMBER ─────────────────────────────────────────────────────▶  │
│  • View teams they belong to                                    │
│  • Can be added to teams                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          TEAM                                    │
│                   (PMA Internship 2026)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ADMIN ─────────────────────────────────────────────────────▶   │
│  (Tim, Dylan for this team)                                     │
│  • Manage sprints                                               │
│  • View all submissions                                         │
│  • Manage team settings                                         │
│  • Add/remove members                                           │
│                                                                  │
│  MEMBER ─────────────────────────────────────────────────────▶  │
│  (Tina, Vanessa, Kim, Linh, Tiffany)                           │
│  • Submit updates                                               │
│  • View team submissions                                        │
│  • Give high fives                                              │
│  • Manage own tasks                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## URL Structure

```
/                           # Public landing page
/login                      # Login page
/signup?invite=xxx          # Accept invite

/mlv                        # Org: MLV (redirects to dashboard)
/mlv/dashboard              # Org overview (admins only)
/mlv/teams                  # List all teams
/mlv/members                # Manage org members
/mlv/settings               # Org settings

/mlv/pma-internship-2026                # Team home
/mlv/pma-internship-2026/submit         # Weekly submission
/mlv/pma-internship-2026/board          # Kanban board
/mlv/pma-internship-2026/recognition    # High fives
/mlv/pma-internship-2026/one-on-one     # 1:1 prep
/mlv/pma-internship-2026/members        # Team members
/mlv/pma-internship-2026/settings       # Team settings

/mlv/sprint-hk-jan-2026                 # Another team
/mlv/sprint-hcm-jan-2026                # Another team
```

## Database Relationships

```
organizations
     │
     ├──────────────────────┐
     │                      │
     ▼                      ▼
org_memberships          teams
     │                      │
     │                      ├──────────────────────┐
     │                      │                      │
     │                      ▼                      ▼
     │               team_memberships          sprints
     │                      │                      │
     │                      │                      │
     ▼                      ▼                      ▼
profiles ◀────────────────────────────────────────┘
     │
     ├─────────────┬─────────────┬─────────────┐
     │             │             │             │
     ▼             ▼             ▼             ▼
submissions   high_fives     tasks      one_on_ones
```

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 | React framework with App Router |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Data storage with RLS |
| Auth | Supabase Auth | Google OAuth + Magic Links |
| Hosting | Vercel | Serverless deployment |
| State | React Context + SWR | Client-side state management |
| Icons | Lucide React | Icon library |
| Animation | Framer Motion | UI animations |
