import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, createSubmission, getSubmissionStats } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const internId = searchParams.get('internId');
    const sprintId = searchParams.get('sprintId');
    const includeStats = searchParams.get('stats') === 'true';

    const filters: { internId?: number; sprintId?: number } = {};
    if (internId) filters.internId = parseInt(internId);
    if (sprintId) filters.sprintId = parseInt(sprintId);

    const submissions = await getSubmissions(filters);
    
    if (includeStats) {
      const stats = await getSubmissionStats(filters.sprintId);
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

    const { internId, sprintId, goals, deliverables, blockers, reflection, mood, hoursWorked } = await request.json();

    // Validation
    if (!internId || !sprintId) {
      return NextResponse.json(
        { error: 'Intern and Sprint selection are required' },
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
      internId,
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
