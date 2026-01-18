-- ============================================
-- Run this AFTER you and Dylan sign up
-- Replace the UUIDs with actual user IDs
-- ============================================

-- Step 1: Find your user IDs
SELECT id, email, full_name, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Step 2: Copy the IDs and run these (uncomment and replace):

-- Make Tim an org owner
-- INSERT INTO org_memberships (user_id, org_id, role)
-- VALUES (
--   'PASTE-TIM-UUID-HERE',
--   'a0000000-0000-0000-0000-000000000001',
--   'owner'
-- );

-- Make Dylan an org owner  
-- INSERT INTO org_memberships (user_id, org_id, role)
-- VALUES (
--   'PASTE-DYLAN-UUID-HERE',
--   'a0000000-0000-0000-0000-000000000001',
--   'owner'
-- );

-- Step 3: Add both to PMA Internship team as admins

-- Tim as team admin
-- INSERT INTO team_memberships (user_id, team_id, role)
-- VALUES (
--   'PASTE-TIM-UUID-HERE',
--   'b0000000-0000-0000-0000-000000000001',
--   'admin'
-- );

-- Dylan as team admin
-- INSERT INTO team_memberships (user_id, team_id, role)
-- VALUES (
--   'PASTE-DYLAN-UUID-HERE',
--   'b0000000-0000-0000-0000-000000000001',
--   'admin'
-- );

-- ============================================
-- Quick verification queries
-- ============================================

-- Check org memberships
-- SELECT p.full_name, p.email, om.role, o.name as org_name
-- FROM org_memberships om
-- JOIN profiles p ON om.user_id = p.id
-- JOIN organizations o ON om.org_id = o.id;

-- Check team memberships
-- SELECT p.full_name, p.email, tm.role, t.name as team_name
-- FROM team_memberships tm
-- JOIN profiles p ON tm.user_id = p.id
-- JOIN teams t ON tm.team_id = t.id;
