import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getTeamMembers, getProfiles } from '@/lib/supabase/database';

// This route now returns team members or all profiles
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (teamId) {
      // Return team members with their profiles
      const members = await getTeamMembers(teamId);
      // Map to a format compatible with old intern structure
      const profiles = members.map(m => ({
        id: m.profile_id,
        ...m.profile,
        team_role: m.role,
      }));
      return NextResponse.json(profiles);
    }

    // Return all profiles (admin use case)
    const profiles = await getProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching members/profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
