import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getHighFives, createHighFive } from '@/lib/db';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const toInternId = searchParams.get('toInternId');
    const fromInternId = searchParams.get('fromInternId');
    const sprintId = searchParams.get('sprintId');
    const limit = searchParams.get('limit');

    const highFives = await getHighFives({
      toInternId: toInternId ? parseInt(toInternId) : undefined,
      fromInternId: fromInternId ? parseInt(fromInternId) : undefined,
      sprintId: sprintId ? parseInt(sprintId) : undefined,
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
    const body = await request.json();
    const { fromInternId, toInternId, message, category, sprintId } = body;

    if (!fromInternId || !toInternId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (fromInternId === toInternId) {
      return NextResponse.json({ error: 'Cannot give high five to yourself' }, { status: 400 });
    }

    const highFive = await createHighFive({
      fromInternId,
      toInternId,
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
