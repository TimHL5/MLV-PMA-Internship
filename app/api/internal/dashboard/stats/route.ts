import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getDashboardStats } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const sprintId = searchParams.get('sprintId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const stats = await getDashboardStats(teamId, sprintId || undefined);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
