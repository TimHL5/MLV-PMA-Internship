import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUserId } from '@/lib/supabase/auth';
import { getSubmissions, createSubmission, getDashboardStats } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const sprintId = searchParams.get('sprintId');
    const teamId = searchParams.get('teamId');
    const includeStats = searchParams.get('stats') === 'true';

    const submissions = await getSubmissions({
      profileId: profileId || undefined,
      sprintId: sprintId || undefined,
    });

    if (includeStats && teamId) {
      const stats = await getDashboardStats(teamId, sprintId || undefined);
      return NextResponse.json({ submissions, stats });
    }

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sprintId, goals, deliverables, blockers, reflection, mood, hoursWorked } = await request.json();

    // Validation
    if (!sprintId) {
      return NextResponse.json(
        { error: 'Sprint selection is required' },
        { status: 400 }
      );
    }

    if (!goals || goals.trim().length < 10) {
      return NextResponse.json(
        { error: 'Goals must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (!deliverables || deliverables.trim().length < 10) {
      return NextResponse.json(
        { error: 'Deliverables must be at least 10 characters' },
        { status: 400 }
      );
    }

    const submission = await createSubmission({
      profileId: currentUserId,
      sprintId,
      goals: goals.trim(),
      deliverables: deliverables.trim(),
      blockers: blockers?.trim() || undefined,
      reflection: reflection?.trim() || undefined,
      mood: mood || undefined,
      hoursWorked: hoursWorked || undefined,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
