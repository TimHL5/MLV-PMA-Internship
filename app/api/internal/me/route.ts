import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getInternProgress } from '@/lib/legacy/db';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const internId = searchParams.get('internId');

    if (!internId) {
      return NextResponse.json({ error: 'Intern ID required' }, { status: 400 });
    }

    const progress = await getInternProgress(parseInt(internId));

    if (!progress) {
      return NextResponse.json({ error: 'Intern not found' }, { status: 404 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
