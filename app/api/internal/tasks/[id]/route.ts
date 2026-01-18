import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/supabase/auth';
import { getKanbanTaskById, updateKanbanTask, deleteKanbanTask, moveKanbanTask } from '@/lib/supabase/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const task = await getKanbanTaskById(id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Handle move operation (column change with position)
    if (body.columnId !== undefined && body.position !== undefined) {
      const task = await moveKanbanTask(id, body.columnId, body.position);
      return NextResponse.json(task);
    }

    // Standard update
    const task = await updateKanbanTask(id, {
      title: body.title,
      description: body.description,
      column_id: body.columnId,
      priority: body.priority,
      assignee_id: body.assigneeId,
      due_date: body.dueDate,
      labels: body.labels,
      position: body.position,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteKanbanTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
