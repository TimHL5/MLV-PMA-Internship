import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUserId } from '@/lib/supabase/auth';
import { getMemberProgress, getCurrentUser, updateProfile } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const teamId = searchParams.get('teamId');

    // If no profileId provided, return current user profile
    if (!profileId) {
      const profile = await getCurrentUser();
      return NextResponse.json(profile);
    }

    // If teamId provided, return full progress
    if (teamId) {
      const progress = await getMemberProgress(teamId, profileId);

      if (!progress) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      return NextResponse.json(progress);
    }

    return NextResponse.json({ error: 'Team ID required for progress' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching profile/progress:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, avatarUrl, timezone, location, linkedinUrl } = body;

    const profile = await updateProfile(currentUserId, {
      full_name: fullName,
      avatar_url: avatarUrl,
      timezone,
      location,
      linkedin_url: linkedinUrl,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
