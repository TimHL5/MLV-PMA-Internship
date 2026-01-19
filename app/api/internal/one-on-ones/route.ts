import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getOneOnOnes, getOrCreateOneOnOne, submitOneOnOnePrep } from '@/lib/legacy/db';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const internId = searchParams.get('internId');
    const sprintId = searchParams.get('sprintId');

    const oneOnOnes = await getOneOnOnes({
      internId: internId ? parseInt(internId) : undefined,
      sprintId: sprintId ? parseInt(sprintId) : undefined,
    });

    return NextResponse.json(oneOnOnes);
  } catch (error) {
    console.error('Error fetching one-on-ones:', error);
    return NextResponse.json({ error: 'Failed to fetch one-on-ones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { internId, sprintId, proudOf, needHelp, questions } = body;

    if (!internId || !sprintId) {
      return NextResponse.json({ error: 'Intern ID and Sprint ID required' }, { status: 400 });
    }

    // Get or create the 1:1 record
    const oneOnOne = await getOrCreateOneOnOne(internId, sprintId);

    // Submit prep
    const updated = await submitOneOnOnePrep(oneOnOne.id, {
      proudOf,
      needHelp,
      questions,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error submitting one-on-one prep:', error);
    return NextResponse.json({ error: 'Failed to submit prep' }, { status: 500 });
  }
}
