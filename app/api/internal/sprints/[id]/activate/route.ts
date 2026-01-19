import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { setActiveSprint } from '@/lib/legacy/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const sprint = await setActiveSprint(parseInt(id));
    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error activating sprint:', error);
    return NextResponse.json({ error: 'Failed to activate sprint' }, { status: 500 });
  }
}
