# MLV Internal Platform - Auth & Loading Fix Summary

## Issues Fixed

### 1. Auth Redirect Bug (Fixed)
**Problem**: After Google OAuth login, users were redirected to `/internal/home` instead of the new Supabase-based dashboard.

**Solution**: Updated `app/auth/callback/route.ts` to:
- Redirect to `/mlv/pma-internship-2026` (new dashboard) by default
- Automatically create a user profile in Supabase if one doesn't exist
- Handle the Google OAuth user metadata properly

### 2. Infinite Loading Spinner (Fixed)
**Problem**: Dashboard stuck on "Loading workspace" spinner.

**Root Cause**: The `TeamProvider` was waiting for auth to complete but never got properly notified when auth was done without a user.

**Solution**: Updated both `AuthProvider.tsx` and `TeamProvider.tsx` to:
- Track auth loading state explicitly
- Set fallback user data if profile fetch fails (prevents infinite loading)
- Properly handle cases where user doesn't exist in the profiles table

### 3. User/Profile Association (Fixed)
**Problem**: Google auth users weren't properly linked to Supabase profiles.

**Solution**:
- Auth callback now checks for and creates profiles automatically
- AuthProvider creates profiles on-demand during sign-in
- Added fallback profile data to prevent UI from getting stuck

### 4. Old Neon Database Code (Cleaned Up)
**Problem**: Codebase had mixed Neon and Supabase code causing confusion.

**Solution**:
- Moved `lib/db.ts` to `lib/legacy/db.ts`
- Updated all `/api/internal/*` routes to use legacy path
- Deprecated `/api/internal/setup` and `/api/internal/seed-team` routes
- Added `/internal` page redirect to `/login`

## Files Modified

### Core Auth Flow
- `app/auth/callback/route.ts` - New redirect logic + profile creation
- `lib/supabase/middleware.ts` - Updated protected routes and redirects
- `components/providers/AuthProvider.tsx` - Better error handling, fallback profile
- `components/providers/TeamProvider.tsx` - Auth loading state awareness

### Legacy Cleanup
- `lib/db.ts` → `lib/legacy/db.ts` (moved)
- `lib/types.ts` → `lib/legacy/types.ts` (copied)
- `app/api/internal/setup/route.ts` - Returns deprecation message
- `app/api/internal/seed-team/route.ts` - Returns deprecation message
- `app/internal/page.tsx` - Redirects to `/login`
- All `/api/internal/*` routes - Updated imports to use legacy path

### New Files
- `supabase-setup/05-add-tim-membership.sql` - SQL to add Tim as org owner

## Testing Checklist

1. ✅ Build succeeds (`npm run build`)
2. ✅ Login page renders at `/login`
3. ✅ Protected routes redirect to `/login` when unauthenticated
4. ✅ Old `/internal` route redirects to `/login`

## Next Steps for Tim

### 1. Run Supabase Seed Data
Make sure the organization and team exist in Supabase:
```sql
-- Run the seed script if not already done
-- See supabase-setup/02-schema.sql (if tables don't exist)
-- See supabase-setup/03-seed-data.sql (for org/team data)
```

### 2. Sign In with Google
1. Go to `interns.mlvignite.com/login` (or `localhost:3001/login` for local)
2. Click "Continue with Google"
3. Sign in with `timmyh.liu@gmail.com`

### 3. Add Yourself as Org Owner
After signing in, run this in Supabase SQL Editor:
```sql
-- See supabase-setup/05-add-tim-membership.sql for full script
INSERT INTO org_memberships (user_id, org_id, role)
SELECT p.id, 'a0000000-0000-0000-0000-000000000001', 'owner'
FROM profiles p
WHERE p.email = 'timmyh.liu@gmail.com'
ON CONFLICT (user_id, org_id) DO UPDATE SET role = 'owner';

INSERT INTO team_members (profile_id, team_id, role)
SELECT p.id, 'b0000000-0000-0000-0000-000000000001', 'admin'
FROM profiles p
WHERE p.email = 'timmyh.liu@gmail.com'
ON CONFLICT (profile_id, team_id) DO UPDATE SET role = 'admin';
```

### 4. Deploy to Vercel
```bash
git add .
git commit -m "Fix auth redirect and loading issues, clean up Neon code"
git push
```

Vercel should auto-deploy. Then test on `interns.mlvignite.com`.

## Architecture Notes

### New Route Structure
- `/login` - Login page (Google OAuth)
- `/auth/callback` - OAuth callback handler
- `/mlv/pma-internship-2026` - Main dashboard (protected)
- `/mlv/pma-internship-2026/board` - Kanban board
- `/mlv/pma-internship-2026/team` - Team page

### Old Routes (Deprecated)
- `/internal/*` - Old Neon-based routes (redirect to new)
- `/api/internal/*` - Old Neon API routes (still work but deprecated)

### Database
- **Production**: Supabase (`lqjisteahvxakzfjuisr.supabase.co`)
- **Schema**: See `supabase-setup/02-schema.sql`
- **Tables**: `organizations`, `teams`, `profiles`, `team_members`, `org_memberships`, `sprints`, `submissions`, etc.
