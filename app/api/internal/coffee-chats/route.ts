import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getCoffeeChats, generateCoffeeChatPairings } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const profileId = searchParams.get('profileId');

    const coffeeChats = await getCoffeeChats({
      teamId: teamId || undefined,
      profileId: profileId || undefined,
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
    const { teamId, action } = body;

    if (action === 'generate') {
      if (!teamId) {
        return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
      }

      const pairings = await generateCoffeeChatPairings(teamId);
      return NextResponse.json(pairings);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error with coffee chat action:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
