-- ============================================
-- MLV Internal Platform - Seed Data
-- Run this AFTER 02-schema.sql
-- ============================================

-- ============================================
-- 1. Create MLV Organization
-- ============================================
INSERT INTO organizations (id, name, slug, description)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'MLV (Makers Lab Ventures)',
  'mlv',
  'Empowering the next generation of entrepreneurs through hands-on education and mentorship.'
);

-- ============================================
-- 2. Create Teams
-- ============================================

-- PMA Internship 2026
INSERT INTO teams (id, org_id, name, slug, description, color)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'PMA Internship 2026',
  'pma-internship-2026',
  'Product Management Associate Internship Program - Spring 2026 Cohort',
  '#6AC670'
);

-- MLV Sprint HK Jan 2026
INSERT INTO teams (id, org_id, name, slug, description, color)
VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Sprint HK - Jan 2026',
  'sprint-hk-jan-2026',
  'MLV Sprint 48-hour entrepreneurship program - Hong Kong January 2026',
  '#F2C94C'
);

-- MLV Sprint HCM Jan 2026  
INSERT INTO teams (id, org_id, name, slug, description, color)
VALUES (
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Sprint HCM - Jan 2026',
  'sprint-hcm-jan-2026',
  'MLV Sprint 48-hour entrepreneurship program - Ho Chi Minh City January 2026',
  '#FF6B6B'
);

-- ============================================
-- 3. Create Sprint for PMA Internship
-- ============================================
INSERT INTO sprints (id, team_id, name, start_date, end_date, is_active)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Sprint 1 - Onboarding',
  '2026-01-16',
  '2026-01-23',
  true
);

INSERT INTO sprints (id, team_id, name, start_date, end_date, is_active)
VALUES (
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'Sprint 2 - Discovery',
  '2026-01-23',
  '2026-01-30',
  false
);

-- ============================================
-- NOTE: User profiles are created automatically
-- when users sign up via Supabase Auth.
-- 
-- After Tim and Dylan sign up with Google OAuth,
-- run this to make them org owners:
-- ============================================

-- EXAMPLE: After Tim signs up (replace with actual user ID from auth.users)
-- INSERT INTO org_memberships (user_id, org_id, role)
-- VALUES ('actual-tim-uuid-here', 'a0000000-0000-0000-0000-000000000001', 'owner');

-- EXAMPLE: After Dylan signs up
-- INSERT INTO org_memberships (user_id, org_id, role)  
-- VALUES ('actual-dylan-uuid-here', 'a0000000-0000-0000-0000-000000000001', 'owner');

-- ============================================
-- Helper query to find user IDs after signup:
-- ============================================
-- SELECT id, email, full_name FROM profiles ORDER BY created_at DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Seed data inserted successfully! 🌱' as status;
SELECT 'Organization: MLV created' as info;
SELECT 'Teams: PMA Internship 2026, Sprint HK, Sprint HCM created' as info;
SELECT 'Next: Sign up with Google OAuth, then add yourself as org owner' as next_step;
