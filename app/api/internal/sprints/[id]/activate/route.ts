import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { setActiveSprint, getSprintById } from '@/lib/supabase/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get the sprint to find its team
    const existingSprint = await getSprintById(id);
    if (!existingSprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    const sprint = await setActiveSprint(existingSprint.team_id, id);
    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error activating sprint:', error);
    return NextResponse.json({ error: 'Failed to activate sprint' }, { status: 500 });
  }
}
