import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getSprints, createSprint, getActiveSprint } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const activeOnly = searchParams.get('active') === 'true';

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    if (activeOnly) {
      const activeSprint = await getActiveSprint(teamId);
      return NextResponse.json(activeSprint);
    }

    const sprints = await getSprints(teamId);
    return NextResponse.json(sprints);
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { teamId, name, startDate, endDate } = body;

    if (!teamId || !name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sprint = await createSprint({
      teamId,
      name,
      startDate,
      endDate,
    });

    return NextResponse.json(sprint, { status: 201 });
  } catch (error) {
    console.error('Error creating sprint:', error);
    return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
  }
}
