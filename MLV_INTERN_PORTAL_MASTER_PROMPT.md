# MLV Intern Portal — Master Build Prompt

## Executive Summary

Build a modern, intuitive internal portal for MLV's Product Management Associate (PMA) internship program. The portal serves 5-8 remote interns distributed across Hong Kong, Ho Chi Minh City, Hanoi, and Singapore during an 8-month co-op experience.

**Primary Users:**
- PM Interns (submitting updates, viewing progress, connecting with peers)
- Tim Liu (Admin — viewing all submissions, tracking accountability, managing sprints)

**Core Philosophy:**
- Simpler than Notion, more focused than Asana
- Fast, mobile-first, minimal clicks
- Accountability through visibility, not surveillance
- Startup culture: celebrate wins, move fast, stay connected

---

## Technical Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 14 (App Router) | Server components by default |
| Database | Neon Postgres (Serverless) | Connection pooling enabled |
| ORM | Raw SQL with `@neondatabase/serverless` | Keep it simple |
| Styling | Tailwind CSS | MLV brand colors pre-configured |
| UI Components | Custom + shadcn/ui primitives | Minimal dependencies |
| Hosting | Vercel | Auto-deploy from GitHub |
| Auth | Simple access code + cookie | Upgrade to individual auth later |
| Real-time | Polling (MVP) → WebSockets (future) | Keep MVP simple |

---

## Brand & Design System

### Colors (from tailwind.config.ts)

```css
/* Primary (60% usage) */
--brand-green: #6AC670;
--primary-light: #8BD490;
--primary-dark: #4FA855;

/* Secondary Accent (30% usage) */
--brand-yellow: #F2CF07;
--secondary-light: #F5DA3A;
--secondary-dark: #D4B506;

/* Backgrounds */
--dark-pure: #060606;
--dark-default: #1a1a2e;
--dark-lighter: #252542;
--dark-card: #2a2a4a;
--light-default: #FCFCFC;
--light-gray: #F3F3F1;

/* Text */
--text-primary: #060606;
--text-secondary: #484848;
--text-light: #F3F3F1;
--text-muted: #6B7280;

/* Status */
--success: #6AC670 (brand-green);
--warning: #F2CF07 (brand-yellow);
--error: #FF6B6B (accent-coral);
--info: #4ECDC4 (accent-teal);
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Scale */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
/* Consistent spacing scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
--shadow-glow-green: 0 0 30px rgba(106, 198, 112, 0.4);
--shadow-glow-yellow: 0 0 30px rgba(242, 207, 7, 0.3);
```

---

## UI/UX Design Principles

### 1. Dark Mode First
- Default to dark theme (matches MLV brand)
- Light mode as optional toggle (future)
- High contrast text on dark backgrounds

### 2. Mobile-First Responsive
- All layouts work on 375px+ screens
- Touch targets minimum 44px
- Bottom navigation on mobile
- Side navigation on desktop (>768px)

### 3. Minimal Clicks
- Most common actions accessible in 1-2 clicks
- Smart defaults (auto-select current sprint, remember last intern)
- Inline editing where possible

### 4. Visual Hierarchy
- Clear section headers
- Adequate whitespace
- Progressive disclosure (expand for details)
- Color coding for status (green=done, yellow=pending, red=missing)

### 5. Micro-interactions
- Subtle hover states
- Loading skeletons (not spinners)
- Success/error toasts
- Smooth transitions (150-300ms)

### 6. Component Patterns

**Cards:**
```jsx
// Dark card with subtle border
<div className="bg-dark-card border border-dark-lighter rounded-xl p-6 hover:border-primary/30 transition-colors">
  {/* content */}
</div>
```

**Buttons:**
```jsx
// Primary action
<button className="bg-primary hover:bg-primary-dark text-dark-pure font-semibold px-6 py-3 rounded-lg transition-colors">
  Submit
</button>

// Secondary action
<button className="bg-dark-lighter hover:bg-dark-card text-light-default border border-dark-lighter px-6 py-3 rounded-lg transition-colors">
  Cancel
</button>

// Ghost/tertiary
<button className="text-text-muted hover:text-primary transition-colors">
  View all →
</button>
```

**Inputs:**
```jsx
<input 
  className="w-full bg-dark-lighter border border-dark-lighter focus:border-primary rounded-lg px-4 py-3 text-light-default placeholder:text-text-muted outline-none transition-colors"
  placeholder="Enter text..."
/>
```

**Status Badges:**
```jsx
// Submitted
<span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
  Submitted
</span>

// Pending
<span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">
  Pending
</span>

// Missing
<span className="bg-accent-coral/20 text-accent-coral px-3 py-1 rounded-full text-sm font-medium">
  Missing
</span>
```

---

## Database Schema (Extended)

```sql
-- ==========================================
-- CORE TABLES (Existing)
-- ==========================================

CREATE TABLE interns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  avatar_url TEXT,                    -- Profile picture URL
  location VARCHAR(50),               -- HK, HCMC, Hanoi, Singapore
  timezone VARCHAR(50),               -- Asia/Hong_Kong, etc.
  role VARCHAR(50) DEFAULT 'intern',  -- intern, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sprints (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,          -- "Sprint 1", "Week 3", etc.
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,    -- Only one active at a time
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  sprint_id INTEGER REFERENCES sprints(id) ON DELETE CASCADE,
  goals TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  blockers TEXT,
  reflection TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),  -- 1-5 scale
  hours_worked INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(intern_id, sprint_id)        -- One submission per intern per sprint
);

-- ==========================================
-- NEW TABLES FOR 6 FEATURES
-- ==========================================

-- Feature 1: Peer Recognition ("High Fives")
CREATE TABLE high_fives (
  id SERIAL PRIMARY KEY,
  from_intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  to_intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category VARCHAR(50),               -- teamwork, creativity, hustle, etc.
  sprint_id INTEGER REFERENCES sprints(id),
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (from_intern_id != to_intern_id)
);

-- Feature 2: Individual Progress (uses existing submissions + computed)
-- No new table needed - computed from submissions

-- Feature 3: 1:1 Prep & Notes
CREATE TABLE one_on_ones (
  id SERIAL PRIMARY KEY,
  intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  sprint_id INTEGER REFERENCES sprints(id),
  scheduled_at TIMESTAMP,
  
  -- Intern fills out before meeting
  proud_of TEXT,                      -- What I'm proud of
  need_help TEXT,                     -- What I need help with
  questions TEXT,                     -- Questions for Tim/Dylan
  prep_submitted_at TIMESTAMP,
  
  -- Admin fills out after meeting
  admin_notes TEXT,                   -- Private notes (only admin sees)
  action_items TEXT,                  -- Follow-up tasks
  meeting_completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Feature 4: Who's Missing (computed view, no table needed)

-- Feature 5: Coffee Chat Matching
CREATE TABLE coffee_chats (
  id SERIAL PRIMARY KEY,
  intern_1_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  intern_2_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  sprint_id INTEGER REFERENCES sprints(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, skipped
  completed_at TIMESTAMP,
  notes TEXT,                          -- Optional: what they talked about
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (intern_1_id != intern_2_id)
);

-- Feature 6: Sprint Project Management (Tasks/Kanban)
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  sprint_id INTEGER REFERENCES sprints(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',   -- todo, in_progress, review, done
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  assignee_id INTEGER REFERENCES interns(id) ON DELETE SET NULL,
  created_by_id INTEGER REFERENCES interns(id),
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  position INTEGER DEFAULT 0,          -- For drag-drop ordering
  parent_task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE, -- Subtasks
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_attachments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_by_id INTEGER REFERENCES interns(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_submissions_intern ON submissions(intern_id);
CREATE INDEX idx_submissions_sprint ON submissions(sprint_id);
CREATE INDEX idx_submissions_date ON submissions(submitted_at DESC);
CREATE INDEX idx_high_fives_to ON high_fives(to_intern_id);
CREATE INDEX idx_high_fives_sprint ON high_fives(sprint_id);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_one_on_ones_intern ON one_on_ones(intern_id);
CREATE INDEX idx_coffee_chats_sprint ON coffee_chats(sprint_id);

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- Who's missing for current sprint
CREATE VIEW missing_submissions AS
SELECT 
  i.id as intern_id,
  i.name as intern_name,
  s.id as sprint_id,
  s.name as sprint_name,
  s.end_date
FROM interns i
CROSS JOIN sprints s
WHERE s.is_active = true
  AND i.role = 'intern'
  AND NOT EXISTS (
    SELECT 1 FROM submissions sub 
    WHERE sub.intern_id = i.id AND sub.sprint_id = s.id
  );

-- Intern stats summary
CREATE VIEW intern_stats AS
SELECT 
  i.id as intern_id,
  i.name,
  COUNT(DISTINCT sub.sprint_id) as sprints_submitted,
  COUNT(DISTINCT hf_received.id) as high_fives_received,
  COUNT(DISTINCT hf_given.id) as high_fives_given,
  COUNT(DISTINCT t.id) as tasks_completed
FROM interns i
LEFT JOIN submissions sub ON i.id = sub.intern_id
LEFT JOIN high_fives hf_received ON i.id = hf_received.to_intern_id
LEFT JOIN high_fives hf_given ON i.id = hf_given.from_intern_id
LEFT JOIN tasks t ON i.id = t.assignee_id AND t.status = 'done'
WHERE i.role = 'intern'
GROUP BY i.id, i.name;
```

---

## Feature Specifications

---

### Feature 1: Peer Recognition System ("High Fives")

**Purpose:** Enable interns to publicly recognize each other's contributions, building a culture of appreciation and startup camaraderie.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| HF-1 | Any intern can give a High Five to any other intern | Must |
| HF-2 | High Five includes: recipient, message (required), category (optional) | Must |
| HF-3 | Categories: Teamwork, Creativity, Hustle, Problem-solving, Communication | Should |
| HF-4 | High Fives appear in a team feed visible to all interns | Must |
| HF-5 | Feed shows most recent first, paginated (10 per page) | Must |
| HF-6 | Interns see their received High Fives count on their profile | Should |
| HF-7 | Weekly leaderboard shows who received most High Fives | Could |
| HF-8 | Emoji reactions on High Fives (🎉 👏 🔥) | Could |

#### UI Components

**Give High Five Modal:**
```
┌─────────────────────────────────────────┐
│  🙌 Give a High Five                  X │
├─────────────────────────────────────────┤
│                                         │
│  Who are you recognizing?               │
│  ┌─────────────────────────────────┐   │
│  │ Select teammate...          ▼   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  What did they do?                      │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │ Helped me debug the API...     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Category (optional)                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │Team│ │Crea│ │Hust│ │Prob│ │Comm│  │
│  │work│ │tive│ │le  │ │lem │ │    │  │
│  └────┘ └────┘ └────┘ └────┘ └────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       🎉 Send High Five         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Feed Card:**
```
┌─────────────────────────────────────────┐
│  👤 Sarah → 👤 Mike          2 hours ago│
│  ─────────────────────────────────────  │
│  "Amazing work on the speaker outreach! │
│   You landed 3 new speakers this week." │
│                                         │
│  🏷️ Hustle                              │
│                                         │
│  🎉 3  👏 2  🔥 1                        │
└─────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/high-fives` | List high fives (paginated, filterable) |
| POST | `/api/internal/high-fives` | Create new high five |
| POST | `/api/internal/high-fives/:id/react` | Add reaction to high five |
| GET | `/api/internal/high-fives/leaderboard` | Get weekly leaderboard |

---

### Feature 2: Individual Progress Dashboard

**Purpose:** Give each intern visibility into their own journey—submissions, streaks, goals achieved, and feedback received.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| IP-1 | Each intern has a personal dashboard at `/internal/me` | Must |
| IP-2 | Shows submission history across all sprints | Must |
| IP-3 | Displays current streak (consecutive weeks submitted) | Must |
| IP-4 | Shows High Fives received with messages | Must |
| IP-5 | Progress chart showing submissions over time | Should |
| IP-6 | Quick stats: total submissions, avg mood, tasks completed | Should |
| IP-7 | Shows upcoming 1:1 prep status | Should |
| IP-8 | Export personal data as PDF | Could |

#### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  My Progress                                    Sarah Chen  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    8     │  │    🔥    │  │    12    │  │    4.2   │   │
│  │ Submits  │  │ 5 Week   │  │ High 5s  │  │ Avg Mood │   │
│  │          │  │ Streak   │  │ Received │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Submission History                                 │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Sprint 8 (Current)                    ⚠️ Not yet  │   │
│  │  Sprint 7                              ✅ Jan 8     │   │
│  │  Sprint 6                              ✅ Jan 1     │   │
│  │  Sprint 5                              ✅ Dec 25    │   │
│  │  Sprint 4                              ❌ Missed    │   │
│  │  Sprint 3                              ✅ Dec 11    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Recent High Fives                        View all → │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  🙌 From Mike: "Crushed the marketing..."  2d ago   │   │
│  │  🙌 From Tim: "Great presentation!"        5d ago   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/me` | Get current intern's profile & stats |
| GET | `/api/internal/me/submissions` | Get my submission history |
| GET | `/api/internal/me/high-fives` | Get high fives I've received |
| GET | `/api/internal/me/stats` | Get my computed statistics |

---

### Feature 3: Async 1:1 Prep & Notes

**Purpose:** Make weekly 1:1 meetings more productive by having interns prep beforehand and enabling admin to keep private notes.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| 1:1-1 | Interns can submit 1:1 prep before their scheduled call | Must |
| 1:1-2 | Prep includes: proud of, need help with, questions | Must |
| 1:1-3 | Admin can view all intern preps from dashboard | Must |
| 1:1-4 | Admin can add private notes after each 1:1 | Must |
| 1:1-5 | Admin notes are NEVER visible to interns | Must |
| 1:1-6 | History of past 1:1s viewable by admin | Should |
| 1:1-7 | Reminder notification when 1:1 prep is due | Could |
| 1:1-8 | Action items from 1:1 can be converted to tasks | Could |

#### UI Components

**Intern View - 1:1 Prep Form:**
```
┌─────────────────────────────────────────────────────────────┐
│  📋 1:1 Prep for Sprint 8                                   │
│  Your call with Tim is scheduled for Friday 3pm HKT         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  What are you proud of this week?                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Landed 2 new speakers for the HCMC event...        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  What do you need help with?                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Struggling with the email copy for sponsors...     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Questions for Tim/Dylan                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ How should I prioritize when I have too many...    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              💾 Save Prep                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Admin View - 1:1 Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│  1:1 Overview - Sprint 8                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Sarah Chen          ✅ Prep submitted    📝 Add notes │  │
│  │ ─────────────────────────────────────────────────────│  │
│  │ Proud: "Landed 2 new speakers..."                    │  │
│  │ Help: "Struggling with email copy..."                │  │
│  │ Questions: "How should I prioritize..."              │  │
│  │                                                      │  │
│  │ 🔒 Private Notes (only you see this):                │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Sarah is doing great but needs more support   │  │  │
│  │ │ on written comms. Pair her with Mike.         │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Mike Johnson        ⚠️ Prep pending      Remind →    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/one-on-ones` | List all 1:1s (admin) |
| GET | `/api/internal/one-on-ones/mine` | Get my 1:1 for current sprint |
| POST | `/api/internal/one-on-ones` | Submit 1:1 prep (intern) |
| PATCH | `/api/internal/one-on-ones/:id` | Update prep or add notes |
| POST | `/api/internal/one-on-ones/:id/notes` | Add admin notes (admin only) |

---

### Feature 4: Who's Missing Accountability Board

**Purpose:** Visual display showing submission status for current sprint—who's submitted, who hasn't.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| WM-1 | Dashboard prominently shows submission status grid | Must |
| WM-2 | Green indicator = submitted, Red = missing, Yellow = overdue | Must |
| WM-3 | Shows days until sprint deadline | Must |
| WM-4 | Click on missing intern to send reminder (future) | Should |
| WM-5 | Historical view: see any past sprint's completion | Should |
| WM-6 | Admin can manually mark submission as excused | Could |

#### UI Component

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Sprint 8 Status           Ends in 2 days (Jan 19)      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  5/8 Submitted (62%)                                        │
│  ████████████████░░░░░░░░░░                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │   ✅ Sarah    ✅ Mike     ✅ Lisa    ✅ James       │  │
│  │                                                      │  │
│  │   ✅ Emma     ❌ David    ❌ Kevin   ❌ Nina        │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Missing: David, Kevin, Nina                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        📧 Send Reminder to Missing (3)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/dashboard/status` | Get current sprint submission status |
| GET | `/api/internal/dashboard/missing` | Get list of interns who haven't submitted |
| POST | `/api/internal/dashboard/remind` | Send reminder to missing interns |

---

### Feature 5: Virtual Coffee Chat Matching

**Purpose:** Random weekly pairing of interns for casual 15-minute video chats to build relationships.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| CC-1 | System automatically pairs interns each sprint | Must |
| CC-2 | Pairs are displayed on dashboard | Must |
| CC-3 | Interns can mark chat as completed | Must |
| CC-4 | Algorithm avoids repeat pairings when possible | Should |
| CC-5 | Shows who you've chatted with previously | Should |
| CC-6 | Optional: add a note about what you discussed | Could |
| CC-7 | Completion rate tracked in stats | Could |

#### Matching Algorithm

```
1. Get all active interns
2. Shuffle list randomly
3. Create pairs (if odd number, one trio)
4. Check against last 3 sprints to avoid repeats
5. If repeat unavoidable, allow it
6. Save pairings to database
```

#### UI Component

**Coffee Chat Card:**
```
┌─────────────────────────────────────────────────────────────┐
│  ☕ This Week's Coffee Chat                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  You're paired with:                                        │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │   👤                                            │    │
│     │   Mike Johnson                                  │    │
│     │   📍 Ho Chi Minh City                           │    │
│     │   🕐 GMT+7                                      │    │
│     │                                                 │    │
│     │   ┌──────────────────────────────────────────┐ │    │
│     │   │  Schedule Chat  │  ✅ Mark Complete      │ │    │
│     │   └──────────────────────────────────────────┘ │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  💡 Suggested topics: weekend plans, favorite podcasts,    │
│     what you're learning, life outside work                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Previous Chats:**
```
┌─────────────────────────────────────────────────────────────┐
│  Past Coffee Chats                                          │
├─────────────────────────────────────────────────────────────┤
│  Sprint 7: Lisa → ✅ Completed                              │
│  Sprint 6: James → ✅ Completed                             │
│  Sprint 5: Emma → ⚠️ Skipped                               │
│  Sprint 4: Kevin → ✅ Completed                             │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/coffee-chats` | List all pairings for sprint |
| GET | `/api/internal/coffee-chats/mine` | Get my current pairing |
| POST | `/api/internal/coffee-chats/generate` | Generate new pairings (admin) |
| PATCH | `/api/internal/coffee-chats/:id` | Mark as completed/skipped |

---

### Feature 6: Sprint Project Board (Kanban)

**Purpose:** Lightweight task management for sprint work—simpler than Notion, more visual than a spreadsheet.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| PB-1 | Kanban board with 4 columns: Todo, In Progress, Review, Done | Must |
| PB-2 | Tasks can be created by any intern or admin | Must |
| PB-3 | Tasks have: title, description, assignee, priority, due date | Must |
| PB-4 | Drag-and-drop to change status | Must |
| PB-5 | Filter by assignee, priority, or search | Must |
| PB-6 | Task detail view with comments | Should |
| PB-7 | Subtasks (checklist within a task) | Should |
| PB-8 | File attachments on tasks | Could |
| PB-9 | Time tracking on tasks | Could |
| PB-10 | Task templates for recurring work | Could |

#### UI Layout - Kanban Board

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  📋 Sprint 8 Board                    + Add Task    🔍 Search    👤 Filter    │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TODO (4)          IN PROGRESS (3)      REVIEW (2)        DONE (8)          │
│  ───────────       ────────────────     ──────────        ────────          │
│                                                                               │
│  ┌─────────────┐   ┌─────────────┐     ┌─────────────┐   ┌─────────────┐   │
│  │ 🔴 Speaker  │   │ 🟡 Email    │     │ 🟢 Landing  │   │ ✅ Logo     │   │
│  │ outreach   │   │ templates  │     │ page copy  │   │ design     │   │
│  │            │   │            │     │            │   │            │   │
│  │ 👤 Sarah   │   │ 👤 Mike    │     │ 👤 Lisa    │   │ 👤 James   │   │
│  │ 📅 Jan 20  │   │ 📅 Jan 18  │     │ 📅 Jan 17  │   │ ✓ Jan 10   │   │
│  └─────────────┘   └─────────────┘     └─────────────┘   └─────────────┘   │
│                                                                               │
│  ┌─────────────┐   ┌─────────────┐     ┌─────────────┐   ┌─────────────┐   │
│  │ 🟡 Social  │   │ 🔴 Partner  │     │ 🟡 Budget  │   │ ✅ Venue   │   │
│  │ media cal │   │ contracts │     │ review    │   │ booked    │   │
│  │            │   │            │     │            │   │            │   │
│  │ 👤 Emma    │   │ 👤 Kevin   │     │ 👤 Tim     │   │ 👤 Nina    │   │
│  │ 📅 Jan 22  │   │ 📅 Jan 19  │     │ 📅 Jan 21  │   │ ✓ Jan 8    │   │
│  └─────────────┘   └─────────────┘     └─────────────┘   └─────────────┘   │
│                                                                               │
│  + Add task        + Add task          + Add task        Completed: 8       │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

#### Task Card Detail

```
┌─────────────────────────────────────────────────────────────┐
│  Speaker Outreach Campaign                              X   │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  Status: 🔴 Todo → In Progress → Review → Done             │
│                                                             │
│  Description:                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Reach out to 10 potential speakers for the HCMC    │   │
│  │ event. Focus on startup founders and VCs.          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  👤 Assignee: Sarah Chen                                    │
│  🔴 Priority: High                                          │
│  📅 Due: Jan 20, 2026                                       │
│  ⏱️ Estimate: 8 hours                                       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Subtasks:                                                  │
│  ☑️ Research speaker list (20 names)                       │
│  ☑️ Draft outreach email template                          │
│  ☐ Send first batch (10 emails)                            │
│  ☐ Follow up on non-responses                              │
│  ☐ Confirm 3 speakers                                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Comments:                                                  │
│                                                             │
│  👤 Mike · 2 hours ago                                      │
│  "I have contacts at Antler, happy to intro!"              │
│                                                             │
│  👤 Sarah · 1 hour ago                                      │
│  "Thanks Mike! Please send over."                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Add a comment...                            Send    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/tasks` | List tasks (filterable by sprint, status, assignee) |
| POST | `/api/internal/tasks` | Create new task |
| GET | `/api/internal/tasks/:id` | Get task details |
| PATCH | `/api/internal/tasks/:id` | Update task |
| DELETE | `/api/internal/tasks/:id` | Delete task |
| PATCH | `/api/internal/tasks/:id/status` | Quick status update (for drag-drop) |
| POST | `/api/internal/tasks/:id/comments` | Add comment to task |
| GET | `/api/internal/tasks/:id/comments` | Get task comments |

---

## Page Structure & Navigation

### Information Architecture

```
/internal
├── / (login)
├── /home (dashboard - main hub)
├── /me (personal progress)
├── /submit (weekly submission form)
├── /board (sprint project board)
├── /team (team feed + high fives)
├── /one-on-one (1:1 prep form)
└── /admin (admin-only dashboard)
    ├── /admin/interns (manage interns)
    ├── /admin/sprints (manage sprints)
    └── /admin/one-on-ones (view all 1:1 preps + notes)
```

### Navigation Design

**Desktop (Sidebar):**
```
┌────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                                      │
│  │  🚀 MLV  │  Intern Portal                                       │
│  └──────────┘                                                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  🏠 Home           Overview & status                         │ │
│  │  👤 My Progress    Personal dashboard                        │ │
│  │  📝 Submit         Weekly check-in                           │ │
│  │  📋 Board          Sprint tasks                              │ │
│  │  👥 Team           Recognition feed                          │ │
│  │  📅 1:1 Prep       Meeting preparation                       │ │
│  │  ──────────────                                              │ │
│  │  ⚙️ Admin          (admin only)                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ────────────────────────────────────────────────────────────────  │
│                                                                    │
│  👤 Sarah Chen                                                     │
│  📍 Hong Kong                                                      │
│  🔓 Logout                                                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Mobile (Bottom Tab Bar):**
```
┌──────────────────────────────────────┐
│                                      │
│          [Main Content Area]         │
│                                      │
├──────────────────────────────────────┤
│  🏠    📝    📋    👥    👤         │
│ Home  Submit Board Team   Me        │
└──────────────────────────────────────┘
```

---

## File Structure

```
app/
├── internal/
│   ├── page.tsx                    # Login page
│   ├── layout.tsx                  # Auth check + nav layout
│   ├── home/
│   │   └── page.tsx                # Main dashboard hub
│   ├── me/
│   │   └── page.tsx                # Personal progress
│   ├── submit/
│   │   └── page.tsx                # Weekly submission form
│   ├── board/
│   │   └── page.tsx                # Kanban project board
│   ├── team/
│   │   └── page.tsx                # Team feed + high fives
│   ├── one-on-one/
│   │   └── page.tsx                # 1:1 prep form
│   └── admin/
│       ├── page.tsx                # Admin dashboard
│       ├── interns/
│       │   └── page.tsx            # Manage interns
│       ├── sprints/
│       │   └── page.tsx            # Manage sprints
│       └── one-on-ones/
│           └── page.tsx            # View all 1:1 preps + notes
│
├── api/
│   └── internal/
│       ├── auth/
│       │   └── route.ts            # Login/logout
│       ├── interns/
│       │   └── route.ts            # CRUD interns
│       ├── sprints/
│       │   └── route.ts            # CRUD sprints
│       ├── submissions/
│       │   └── route.ts            # CRUD submissions
│       ├── high-fives/
│       │   └── route.ts            # CRUD high fives
│       ├── tasks/
│       │   ├── route.ts            # CRUD tasks
│       │   └── [id]/
│       │       ├── route.ts        # Single task
│       │       └── comments/
│       │           └── route.ts    # Task comments
│       ├── one-on-ones/
│       │   └── route.ts            # CRUD 1:1s
│       ├── coffee-chats/
│       │   └── route.ts            # CRUD coffee chats
│       └── dashboard/
│           └── route.ts            # Dashboard stats
│
lib/
├── db.ts                           # Database connection
├── auth.ts                         # Auth utilities
├── types.ts                        # TypeScript types
└── utils.ts                        # Helper functions
│
components/
├── ui/                             # Shadcn/custom primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   └── skeleton.tsx
│
├── internal/
│   ├── nav/
│   │   ├── Sidebar.tsx             # Desktop navigation
│   │   └── BottomNav.tsx           # Mobile navigation
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── MissingBoard.tsx
│   │   ├── CoffeeChatCard.tsx
│   │   └── QuickActions.tsx
│   ├── submissions/
│   │   ├── SubmissionForm.tsx
│   │   ├── SubmissionTable.tsx
│   │   └── SubmissionCard.tsx
│   ├── high-fives/
│   │   ├── HighFiveModal.tsx
│   │   ├── HighFiveFeed.tsx
│   │   └── HighFiveCard.tsx
│   ├── tasks/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   └── TaskComments.tsx
│   ├── one-on-one/
│   │   ├── PrepForm.tsx
│   │   ├── AdminNotesForm.tsx
│   │   └── OneOnOneList.tsx
│   └── progress/
│       ├── ProgressStats.tsx
│       ├── SubmissionHistory.tsx
│       └── StreakDisplay.tsx
```

---

## API Response Formats

### Standard Response Wrapper

```typescript
// Success
{
  success: true,
  data: T,
  meta?: {
    page?: number,
    pageSize?: number,
    total?: number
  }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### Example Responses

**GET /api/internal/tasks**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Speaker outreach",
      "description": "Reach out to 10 potential speakers...",
      "status": "todo",
      "priority": "high",
      "assignee": {
        "id": 1,
        "name": "Sarah Chen",
        "avatar_url": null
      },
      "due_date": "2026-01-20",
      "sprint_id": 8,
      "subtasks": [
        { "id": 1, "title": "Research speaker list", "completed": true },
        { "id": 2, "title": "Draft outreach email", "completed": true },
        { "id": 3, "title": "Send first batch", "completed": false }
      ],
      "comment_count": 3,
      "created_at": "2026-01-10T10:00:00Z"
    }
  ],
  "meta": {
    "total": 15
  }
}
```

**GET /api/internal/dashboard/status**
```json
{
  "success": true,
  "data": {
    "sprint": {
      "id": 8,
      "name": "Sprint 8",
      "end_date": "2026-01-19",
      "days_remaining": 2
    },
    "submissions": {
      "total_interns": 8,
      "submitted": 5,
      "missing": 3,
      "percentage": 62.5
    },
    "interns": [
      { "id": 1, "name": "Sarah Chen", "submitted": true, "submitted_at": "2026-01-15T10:00:00Z" },
      { "id": 2, "name": "Mike Johnson", "submitted": true, "submitted_at": "2026-01-14T15:30:00Z" },
      { "id": 3, "name": "David Park", "submitted": false, "submitted_at": null }
    ]
  }
}
```

---

## Environment Variables

```env
# Database (Neon Postgres via Vercel)
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Authentication
ACCESS_CODE=mlv2026internal
ADMIN_CODE=mlv2026admin

# Optional: Future features
SLACK_WEBHOOK_URL=           # For reminders
RESEND_API_KEY=              # For email notifications
```

---

## Implementation Priority

### Phase 1: Core Foundation (Week 1)
1. ✅ Database schema migration (add new tables)
2. Update existing submission form with mood/hours
3. Implement Feature 4: Who's Missing Board
4. Update navigation with new structure

### Phase 2: Individual & Team (Week 2)
5. Implement Feature 2: Individual Progress Dashboard
6. Implement Feature 1: Peer Recognition (High Fives)
7. Implement Feature 5: Coffee Chat Matching

### Phase 3: Productivity (Week 3)
8. Implement Feature 6: Sprint Project Board (Kanban)
9. Implement Feature 3: Async 1:1 Prep & Notes

### Phase 4: Polish (Week 4)
10. Mobile optimization
11. Loading states & error handling
12. Admin controls refinement
13. Export features (CSV, PDF)

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Submission completion rate | >90% | submissions / (interns × sprints) |
| High Five activity | 2+ per intern per week | total high fives / interns / weeks |
| Coffee chat completion | >80% | completed chats / total pairings |
| Task completion rate | >75% | done tasks / total tasks per sprint |
| 1:1 prep submission | 100% | prep submitted / scheduled 1:1s |
| Page load time | <2s | Vercel analytics |
| Mobile usage | Track % | Analytics |

---

## Notes for Claude Code

### Priorities
1. **Ship fast** - This is internal tooling, not a product
2. **Mobile-first** - Interns submit from phones
3. **Dark mode** - Matches MLV brand
4. **Minimal dependencies** - Keep bundle size small

### Code Style
- Use server components by default
- Client components only when needed (interactivity)
- Tailwind for all styling (no CSS files)
- Type everything with TypeScript
- Use `@/` path alias for imports

### UX Principles
- Every action should have visual feedback
- Use skeleton loaders, not spinners
- Toast notifications for success/error
- Optimistic updates where possible
- Remember user preferences (last selected intern/sprint)

### Don't Overcomplicate
- No real-time updates (polling is fine for MVP)
- No file uploads (use external links)
- No notifications (manual reminders for now)
- No analytics dashboard (use Vercel analytics)

---

## Quick Reference Commands

```bash
# Run locally
npm run dev

# Database migration
npm run db:migrate

# Seed sample data
npm run db:seed

# Deploy
vercel --prod

# Check types
npm run type-check
```

---

*Last updated: January 15, 2026*
*Version: 2.0*
*Author: Tim Liu & Claude*
