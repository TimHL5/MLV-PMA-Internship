import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getKanbanTasks, createKanbanTask } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const columnId = searchParams.get('columnId');
    const assigneeId = searchParams.get('assigneeId');

    const tasks = await getKanbanTasks({
      teamId: teamId || undefined,
      columnId: columnId || undefined,
      assigneeId: assigneeId || undefined,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { teamId, columnId, title, description, priority, assigneeId, dueDate, labels } = body;

    if (!teamId || !columnId || !title) {
      return NextResponse.json({ error: 'Team ID, Column ID, and title are required' }, { status: 400 });
    }

    const task = await createKanbanTask({
      teamId,
      columnId,
      title,
      description,
      priority,
      assigneeId,
      dueDate,
      labels,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
