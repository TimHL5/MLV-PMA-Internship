import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getSubmissionStatus } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const sprintId = searchParams.get('sprintId');

    if (!teamId || !sprintId) {
      return NextResponse.json({ error: 'Team ID and Sprint ID required' }, { status: 400 });
    }

    const status = await getSubmissionStatus(teamId, sprintId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching submission status:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
