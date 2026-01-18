import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { updateCoffeeChatStatus } from '@/lib/supabase/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status || !['pending', 'scheduled', 'completed', 'skipped'].includes(status)) {
      return NextResponse.json({ error: 'Valid status required' }, { status: 400 });
    }

    const coffeeChat = await updateCoffeeChatStatus(id, status, notes);
    return NextResponse.json(coffeeChat);
  } catch (error) {
    console.error('Error updating coffee chat:', error);
    return NextResponse.json({ error: 'Failed to update coffee chat' }, { status: 500 });
  }
}
