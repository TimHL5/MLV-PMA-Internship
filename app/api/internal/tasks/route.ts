import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getTasks, createTask, TaskStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sprintId = searchParams.get('sprintId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status') as TaskStatus | null;

    const tasks = await getTasks({
      sprintId: sprintId ? parseInt(sprintId) : undefined,
      assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
      status: status || undefined,
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
    const { sprintId, title, description, priority, assigneeId, createdById, dueDate, estimatedHours, parentTaskId } = body;

    if (!sprintId || !title) {
      return NextResponse.json({ error: 'Sprint ID and title are required' }, { status: 400 });
    }

    const task = await createTask({
      sprintId,
      title,
      description,
      priority,
      assigneeId,
      createdById,
      dueDate,
      estimatedHours,
      parentTaskId,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
