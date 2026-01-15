import { NextRequest, NextResponse } from 'next/server';
import { getInterns, createIntern } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interns = await getInterns();
    return NextResponse.json(interns);
  } catch (error) {
    console.error('Error fetching interns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interns' },
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

    const { name, email } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const intern = await createIntern(name, email);
    return NextResponse.json(intern, { status: 201 });
  } catch (error) {
    console.error('Error creating intern:', error);
    return NextResponse.json(
      { error: 'Failed to create intern' },
      { status: 500 }
    );
  }
}
