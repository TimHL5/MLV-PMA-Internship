# MLV Intern Tracker - Project Scope Document

## Overview
A lightweight internal tool for MLV PM interns to track their weekly progress, goals, and deliverables across sprint cycles. The tool provides accountability and visibility into intern productivity.

**URL:** `interns.mlvignite.com` (subdomain of existing site)
**Access:** Password-protected (simple access code)

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Neon Postgres (Serverless) |
| Styling | Tailwind CSS (MLV brand colors) |
| Hosting | Vercel |
| Auth | Simple access code (env variable) |

---

## Database Schema

```sql
-- Already created in Neon
CREATE TABLE interns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sprints (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  intern_id INTEGER REFERENCES interns(id),
  sprint_id INTEGER REFERENCES sprints(id),
  goals TEXT,
  deliverables TEXT,
  blockers TEXT,
  reflection TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

---

## Functional Requirements

### 1. Login Page (`/internal`)

**Purpose:** Gate access to the intern tracker with a simple access code.

**Features:**
- [ ] Clean, branded login form with access code input
- [ ] Access code validated against `ACCESS_CODE` env variable
- [ ] Session persisted via HTTP-only cookie (24-hour expiry)
- [ ] Error message for incorrect code
- [ ] MLV branding (logo, colors)

**User Flow:**
1. User visits `/internal`
2. Enter access code
3. If valid → redirect to `/internal/submit`
4. If invalid → show error, stay on page

---

### 2. Submission Form (`/internal/submit`)

**Purpose:** Interns submit their weekly progress update.

**Features:**
- [ ] Dropdown to select intern name (pulled from `interns` table)
- [ ] Dropdown to select current sprint (pulled from `sprints` table)
- [ ] Text areas for:
  - **Goals this week** (required) - What they plan to accomplish
  - **Deliverables completed** (required) - What they actually finished
  - **Blockers** (optional) - What's preventing progress
  - **Reflection** (optional) - What they learned
- [ ] Submit button with loading state
- [ ] Success confirmation after submission
- [ ] Link to view dashboard
- [ ] Logout option

**Validation:**
- Intern selection required
- Sprint selection required
- Goals field required (min 10 characters)
- Deliverables field required (min 10 characters)

---

### 3. Admin Dashboard (`/internal/dashboard`)

**Purpose:** View all intern submissions at a glance.

**Features:**
- [ ] Table view of all submissions
- [ ] Filter by:
  - Intern name
  - Sprint
  - Date range
- [ ] Sort by submission date (newest first by default)
- [ ] Visual indicator for missing submissions (who hasn't submitted this sprint)
- [ ] Click to expand full submission details
- [ ] Export to CSV option
- [ ] Quick stats at top:
  - Total submissions this sprint
  - Interns who submitted vs. total
  - Average submission time

**Table Columns:**
| Intern | Sprint | Goals | Deliverables | Blockers | Submitted |
|--------|--------|-------|--------------|----------|-----------|

---

## Non-Functional Requirements

### Security
- Access code stored in environment variable (not hardcoded)
- HTTP-only cookies for session management
- All routes under `/internal/*` protected by middleware
- No sensitive data exposed in client-side code

### Performance
- Page load < 2 seconds
- Database queries optimized with indexes
- Server-side rendering for initial load

### UX/Design
- Mobile-responsive (interns may submit from phone)
- MLV brand colors (green #6AC670, yellow #F2CF07, dark backgrounds)
- Clear visual feedback for all actions
- Intuitive form layout with proper spacing
- Loading states for all async operations

---

## File Structure

```
app/
├── internal/
│   ├── page.tsx              # Login page
│   ├── layout.tsx            # Internal layout (checks auth)
│   ├── submit/
│   │   └── page.tsx          # Submission form
│   └── dashboard/
│       └── page.tsx          # Admin dashboard
├── api/
│   └── internal/
│       ├── auth/
│       │   └── route.ts      # Login/logout endpoints
│       ├── interns/
│       │   └── route.ts      # Get interns list
│       ├── sprints/
│       │   └── route.ts      # Get/create sprints
│       └── submissions/
│           └── route.ts      # Get/create submissions
lib/
├── db.ts                     # Database connection
└── auth.ts                   # Auth utilities
components/
└── internal/
    ├── LoginForm.tsx
    ├── SubmissionForm.tsx
    ├── Dashboard.tsx
    ├── SubmissionTable.tsx
    └── StatsCards.tsx
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/internal/auth` | Validate access code, set cookie |
| DELETE | `/api/internal/auth` | Clear cookie (logout) |

### Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internal/interns` | List all interns |
| POST | `/api/internal/interns` | Add new intern |
| GET | `/api/internal/sprints` | List all sprints |
| POST | `/api/internal/sprints` | Create new sprint |
| GET | `/api/internal/submissions` | List submissions (with filters) |
| POST | `/api/internal/submissions` | Create new submission |

---

## Environment Variables

```env
# Already configured via Vercel
POSTGRES_URL=...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# Need to add
ACCESS_CODE=mlv2026internal  # Simple access code for login
```

---

## Implementation Phases

### Phase 1: Core Setup (Day 1)
- [x] Database tables created
- [x] Neon driver installed
- [x] Environment variables configured
- [ ] Database connection utility (`lib/db.ts`)
- [ ] Auth utility (`lib/auth.ts`)
- [ ] Middleware for protected routes

### Phase 2: Authentication (Day 1)
- [ ] Login page UI
- [ ] Auth API endpoint
- [ ] Cookie management
- [ ] Protected route middleware

### Phase 3: Submission Form (Day 2)
- [ ] API endpoints for interns/sprints
- [ ] Submission form UI
- [ ] Form validation
- [ ] Submission API endpoint
- [ ] Success/error handling

### Phase 4: Dashboard (Day 2-3)
- [ ] Dashboard UI with filters
- [ ] Submissions table component
- [ ] Stats cards
- [ ] CSV export functionality

### Phase 5: Polish & Deploy (Day 3)
- [ ] Mobile responsiveness
- [ ] Loading states
- [ ] Error handling
- [ ] Subdomain configuration
- [ ] Production deployment

---

## Success Criteria

1. ✅ Interns can log in with access code
2. ✅ Interns can submit weekly updates
3. ✅ Admin can view all submissions in dashboard
4. ✅ Dashboard shows who has/hasn't submitted
5. ✅ Mobile-friendly design
6. ✅ Fast page loads (< 2s)
7. ✅ MLV branded UI

---

## Future Enhancements (Post-MVP)

- Email reminders for missing submissions
- Individual intern login (vs. shared code)
- Progress charts and analytics
- Goal completion tracking
- Slack integration for notifications
- PDF export of weekly reports

---

## Notes for Claude Code

When implementing, prioritize:
1. **Simplicity** - This is an internal tool, not a product
2. **Speed** - Build fast, iterate later
3. **Reliability** - Data must save correctly
4. **Brand consistency** - Use MLV colors from tailwind.config.ts

Use the existing MLV brand colors defined in `tailwind.config.ts`:
- Primary green: `brand-green` (#6AC670)
- Accent yellow: `brand-yellow` (#F2CF07)
- Dark background: `dark-pure` (#060606)
- Light background: `light-DEFAULT` (#FCFCFC)
