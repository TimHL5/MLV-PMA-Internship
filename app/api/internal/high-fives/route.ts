import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUserId } from '@/lib/supabase/auth';
import { getHighFives, createHighFive } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const toProfileId = searchParams.get('toProfileId');
    const fromProfileId = searchParams.get('fromProfileId');
    const sprintId = searchParams.get('sprintId');
    const limit = searchParams.get('limit');

    const highFives = await getHighFives({
      teamId: teamId || undefined,
      toProfileId: toProfileId || undefined,
      fromProfileId: fromProfileId || undefined,
      sprintId: sprintId || undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(highFives);
  } catch (error) {
    console.error('Error fetching high fives:', error);
    return NextResponse.json({ error: 'Failed to fetch high fives' }, { status: 500 });
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
    const { teamId, toProfileId, message, category, sprintId } = body;

    if (!teamId || !toProfileId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (currentUserId === toProfileId) {
      return NextResponse.json({ error: 'Cannot give high five to yourself' }, { status: 400 });
    }

    const highFive = await createHighFive({
      teamId,
      fromProfileId: currentUserId,
      toProfileId,
      message,
      category,
      sprintId,
    });

    return NextResponse.json(highFive);
  } catch (error) {
    console.error('Error creating high five:', error);
    return NextResponse.json({ error: 'Failed to create high five' }, { status: 500 });
  }
}
