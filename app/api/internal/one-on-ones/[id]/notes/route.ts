import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { addAdminNotes } from '@/lib/legacy/db';

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
    const { adminNotes, actionItems, completed } = body;

    const updated = await addAdminNotes(parseInt(id), {
      adminNotes,
      actionItems,
      completed,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error adding admin notes:', error);
    return NextResponse.json({ error: 'Failed to add notes' }, { status: 500 });
  }
}
