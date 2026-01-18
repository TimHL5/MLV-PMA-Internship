import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUserId } from '@/lib/supabase/auth';
import { getOneOnOneNotes, getOrCreateOneOnOneNote, updateOneOnOneNote } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const profileId = searchParams.get('profileId');
    const sprintId = searchParams.get('sprintId');

    const oneOnOneNotes = await getOneOnOneNotes({
      teamId: teamId || undefined,
      profileId: profileId || undefined,
      sprintId: sprintId || undefined,
    });

    return NextResponse.json(oneOnOneNotes);
  } catch (error) {
    console.error('Error fetching one-on-one notes:', error);
    return NextResponse.json({ error: 'Failed to fetch one-on-one notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, sprintId, wins, challenges, discussionTopics, actionItems } = body;

    if (!teamId || !sprintId) {
      return NextResponse.json({ error: 'Team ID and Sprint ID required' }, { status: 400 });
    }

    // Get or create the 1:1 note record
    const oneOnOneNote = await getOrCreateOneOnOneNote(teamId, currentUserId, sprintId);

    // Update with the submitted data
    const updated = await updateOneOnOneNote(oneOnOneNote.id, {
      wins,
      challenges,
      discussion_topics: discussionTopics,
      action_items: actionItems,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error submitting one-on-one notes:', error);
    return NextResponse.json({ error: 'Failed to submit notes' }, { status: 500 });
  }
}
