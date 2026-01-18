# Supabase Setup Guide for MLV Internal Platform

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign in with GitHub (or create account)
3. Click "New Project"
4. Fill in:
   - **Name:** `mlv-internal-platform`
   - **Database Password:** Generate a strong password (SAVE THIS!)
   - **Region:** Choose closest to your users (e.g., `us-east-1` for US East)
5. Click "Create new project"
6. Wait 2-3 minutes for project to provision

## Step 2: Get Your Credentials

Once project is ready:

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

3. Save these in a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard (left sidebar)
2. Click "New Query"
3. Copy the contents of `02-schema.sql` and paste it
4. Click "Run" (or Cmd+Enter)
5. You should see "Success. No rows returned"

## Step 4: Set Up Authentication

### Enable Google OAuth:
1. Go to **Authentication** → **Providers**
2. Find "Google" and enable it
3. You'll need to create Google OAuth credentials:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret back to Supabase

### Enable Magic Link (Email):
1. Go to **Authentication** → **Providers**
2. "Email" should be enabled by default
3. Go to **Authentication** → **Email Templates**
4. Customize the magic link email if desired

## Step 5: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://interns.mlvignite.com/**` (for production)

## Step 6: Seed Initial Data

1. Go to **SQL Editor**
2. Run the contents of `03-seed-data.sql`
3. This creates:
   - MLV organization
   - Initial admin users (Tim, Dylan)
   - Sample team (PMA Internship 2026)

## Step 7: Update Vercel Environment Variables

1. Go to Vercel Dashboard → your project → Settings → Environment Variables
2. Add the three Supabase variables
3. Redeploy the project

## Verification Checklist

- [ ] Project created in Supabase
- [ ] Credentials saved in `.env.local`
- [ ] Schema SQL executed successfully
- [ ] Google OAuth configured
- [ ] Magic Link email enabled
- [ ] Site URL and redirects configured
- [ ] Seed data inserted
- [ ] Vercel env vars updated

## Troubleshooting

### "Permission denied" errors
- Make sure RLS policies are correct
- Check that the user has proper role in memberships table

### Auth not working
- Verify redirect URLs are correct
- Check that Google OAuth credentials match

### Database connection issues
- Ensure you're using the correct project URL
- Check that anon key is the PUBLIC one (not service role)
