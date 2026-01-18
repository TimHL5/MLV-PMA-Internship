import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { updateOneOnOneNote, getOneOnOneNoteById } from '@/lib/supabase/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const note = await getOneOnOneNoteById(id);

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching one-on-one note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { managerNotes, actionItems } = body;

    const updated = await updateOneOnOneNote(id, {
      manager_notes: managerNotes,
      action_items: actionItems,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error adding manager notes:', error);
    return NextResponse.json({ error: 'Failed to add notes' }, { status: 500 });
  }
}
