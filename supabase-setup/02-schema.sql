-- ============================================
-- MLV Internal Platform - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ORGANIZATIONS
-- Top-level company/organization
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PROFILES (extends Supabase auth.users)
-- User profile information
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. ORGANIZATION MEMBERSHIPS
-- Links users to organizations with roles
-- ============================================
CREATE TABLE org_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

-- ============================================
-- 4. TEAMS
-- Teams/groups within an organization
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6AC670', -- Hex color for team
  icon VARCHAR(50) DEFAULT 'users', -- Icon name
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

-- ============================================
-- 5. TEAM MEMBERSHIPS
-- Links users to teams with roles
-- ============================================
CREATE TABLE team_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- ============================================
-- 6. SPRINTS
-- Time-boxed periods for teams
-- ============================================
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. SUBMISSIONS
-- Weekly check-ins/updates from team members
-- ============================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  goals TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  blockers TEXT,
  reflection TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  hours_worked INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sprint_id)
);

-- ============================================
-- 8. HIGH FIVES
-- Peer recognition/kudos
-- ============================================
CREATE TABLE high_fives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  category VARCHAR(50), -- 'teamwork', 'innovation', 'leadership', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (from_user_id != to_user_id)
);

-- ============================================
-- 9. TASKS
-- Kanban board tasks
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  position INTEGER DEFAULT 0,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 10. TASK COMMENTS
-- Comments on tasks
-- ============================================
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. COFFEE CHATS
-- Random pairing for virtual coffee chats
-- ============================================
CREATE TABLE coffee_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  user_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'skipped')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (user_1_id != user_2_id)
);

-- ============================================
-- 12. ONE-ON-ONES
-- 1:1 meeting prep and notes
-- ============================================
CREATE TABLE one_on_ones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  -- Employee prep
  proud_of TEXT,
  need_help TEXT,
  questions TEXT,
  prep_submitted_at TIMESTAMP WITH TIME ZONE,
  -- Manager notes
  manager_notes TEXT,
  action_items TEXT,
  meeting_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 13. INVITATIONS
-- Pending invitations to org/team
-- ============================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE, -- Optional: direct team invite
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token VARCHAR(100) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 14. ACTIVITY LOG
-- Track important actions for audit trail
-- ============================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- 'submission_created', 'high_five_sent', etc.
  entity_type VARCHAR(50), -- 'submission', 'task', 'high_five', etc.
  entity_id UUID,
  metadata JSONB, -- Additional context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_org_memberships_user ON org_memberships(user_id);
CREATE INDEX idx_org_memberships_org ON org_memberships(org_id);
CREATE INDEX idx_team_memberships_user ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team ON team_memberships(team_id);
CREATE INDEX idx_teams_org ON teams(org_id);
CREATE INDEX idx_sprints_team ON sprints(team_id);
CREATE INDEX idx_sprints_active ON sprints(team_id, is_active);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_sprint ON submissions(sprint_id);
CREATE INDEX idx_high_fives_to ON high_fives(to_user_id);
CREATE INDEX idx_high_fives_from ON high_fives(from_user_id);
CREATE INDEX idx_high_fives_team ON high_fives(team_id);
CREATE INDEX idx_tasks_team ON tasks(team_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX idx_one_on_ones_user ON one_on_ones(user_id);
CREATE INDEX idx_coffee_chats_team ON coffee_chats(team_id);
CREATE INDEX idx_activity_log_org ON activity_log(org_id);
CREATE INDEX idx_activity_log_team ON activity_log(team_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_one_on_ones_updated_at BEFORE UPDATE ON one_on_ones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE high_fives ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can view profiles of people in their orgs
CREATE POLICY "Users can view profiles in their orgs" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR
    id IN (
      SELECT om2.user_id FROM org_memberships om1
      JOIN org_memberships om2 ON om1.org_id = om2.org_id
      WHERE om1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Organizations: Users can view orgs they belong to
CREATE POLICY "Users can view their orgs" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Org owners can update org" ON organizations
  FOR UPDATE USING (
    id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Org Memberships: Users can view memberships in their orgs
CREATE POLICY "Users can view org memberships" ON org_memberships
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Org admins can manage memberships" ON org_memberships
  FOR ALL USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Teams: Users can view teams in their orgs
CREATE POLICY "Users can view teams in their orgs" ON teams
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Org admins can manage teams" ON teams
  FOR ALL USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Team Memberships: Users can view team memberships in their teams
CREATE POLICY "Users can view team memberships" ON team_memberships
  FOR SELECT USING (
    team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can manage team memberships" ON team_memberships
  FOR ALL USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid() AND role = 'admin')
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

-- Sprints: Team members can view sprints
CREATE POLICY "Team members can view sprints" ON sprints
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team admins can manage sprints" ON sprints
  FOR ALL USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid() AND role = 'admin')
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

-- Submissions: Team members can view submissions, users can edit own
CREATE POLICY "Team members can view submissions" ON submissions
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can create own submissions" ON submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own submissions" ON submissions
  FOR UPDATE USING (user_id = auth.uid());

-- High Fives: Team members can view and create
CREATE POLICY "Team members can view high fives" ON high_fives
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team members can create high fives" ON high_fives
  FOR INSERT WITH CHECK (
    from_user_id = auth.uid() AND
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
  );

-- Tasks: Team members can view and manage
CREATE POLICY "Team members can view tasks" ON tasks
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
    OR team_id IN (
      SELECT t.id FROM teams t
      JOIN org_memberships om ON t.org_id = om.org_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team members can manage tasks" ON tasks
  FOR ALL USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
  );

-- Task Comments
CREATE POLICY "Team members can view task comments" ON task_comments
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Team members can create task comments" ON task_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Coffee Chats
CREATE POLICY "Team members can view coffee chats" ON coffee_chats
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
    OR user_1_id = auth.uid() OR user_2_id = auth.uid()
  );

CREATE POLICY "Team admins can manage coffee chats" ON coffee_chats
  FOR ALL USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid() AND role = 'admin')
  );

-- One-on-Ones
CREATE POLICY "Users can view own one-on-ones" ON one_on_ones
  FOR SELECT USING (
    user_id = auth.uid() OR manager_id = auth.uid()
    OR team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can manage own one-on-ones" ON one_on_ones
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Managers can update one-on-ones" ON one_on_ones
  FOR UPDATE USING (manager_id = auth.uid());

-- Invitations
CREATE POLICY "Org admins can view invitations" ON invitations
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

CREATE POLICY "Org admins can manage invitations" ON invitations
  FOR ALL USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Activity Log (read-only for members, admins can see all)
CREATE POLICY "Org members can view activity" ON activity_log
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid())
  );

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Schema created successfully! 🎉' as status;
