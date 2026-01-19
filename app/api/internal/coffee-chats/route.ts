import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getCoffeeChats, generateCoffeeChatPairings } from '@/lib/legacy/db';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const internId = searchParams.get('internId');
    const sprintId = searchParams.get('sprintId');

    const coffeeChats = await getCoffeeChats({
      internId: internId ? parseInt(internId) : undefined,
      sprintId: sprintId ? parseInt(sprintId) : undefined,
    });

    return NextResponse.json(coffeeChats);
  } catch (error) {
    console.error('Error fetching coffee chats:', error);
    return NextResponse.json({ error: 'Failed to fetch coffee chats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sprintId, action } = body;

    if (action === 'generate') {
      if (!sprintId) {
        return NextResponse.json({ error: 'Sprint ID required' }, { status: 400 });
      }

      const pairings = await generateCoffeeChatPairings(sprintId);
      return NextResponse.json(pairings);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error with coffee chat action:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
