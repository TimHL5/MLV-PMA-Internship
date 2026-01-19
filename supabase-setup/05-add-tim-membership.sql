-- ============================================
-- Add Tim's org and team memberships
-- Run this AFTER Tim has logged in with Google OAuth
-- ============================================

-- First, check if Tim's profile exists
SELECT
  id,
  email,
  full_name,
  created_at
FROM profiles
WHERE email LIKE '%tim%' OR email LIKE '%makers%' OR email LIKE '%mlv%'
ORDER BY created_at DESC;

-- ============================================
-- If Tim's profile exists, run these commands
-- Replace 'TIMS-UUID-HERE' with the actual ID from above
-- ============================================

-- Option 1: If you know Tim's email
-- Add org membership (owner)
INSERT INTO org_memberships (user_id, org_id, role)
SELECT p.id, 'a0000000-0000-0000-0000-000000000001', 'owner'
FROM profiles p
WHERE p.email = 'timmyh.liu@gmail.com'
ON CONFLICT (user_id, org_id) DO UPDATE SET role = 'owner';

-- Add team membership (admin)
INSERT INTO team_members (profile_id, team_id, role)
SELECT p.id, 'b0000000-0000-0000-0000-000000000001', 'admin'
FROM profiles p
WHERE p.email = 'timmyh.liu@gmail.com'
ON CONFLICT (profile_id, team_id) DO UPDATE SET role = 'admin';

-- ============================================
-- Verify the setup
-- ============================================
SELECT 'Tim Membership Status:' as info;

SELECT
  p.email,
  p.full_name,
  o.name as org_name,
  om.role as org_role
FROM profiles p
LEFT JOIN org_memberships om ON p.id = om.user_id
LEFT JOIN organizations o ON om.org_id = o.id
WHERE p.email = 'timmyh.liu@gmail.com';

SELECT
  p.email,
  p.full_name,
  t.name as team_name,
  tm.role as team_role
FROM profiles p
LEFT JOIN team_members tm ON p.id = tm.profile_id
LEFT JOIN teams t ON tm.team_id = t.id
WHERE p.email = 'timmyh.liu@gmail.com';

SELECT 'Setup complete! Tim should now be able to access /mlv/pma-internship-2026' as status;
