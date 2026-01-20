'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { KanbanColumn, KanbanTask, Profile } from '@/lib/types';
import { toast } from 'sonner';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  X,
  GripVertical,
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskWithAssignee extends KanbanTask {
  assignee?: Profile;
}

interface ColumnWithTasks extends KanbanColumn {
  tasks: TaskWithAssignee[];
}

const PRIORITY_COLORS = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-brand-yellow/20 text-brand-yellow',
  urgent: 'bg-accent-coral/20 text-accent-coral',
};

const DEFAULT_COLUMNS = [
  { name: 'To Do', color: '#6B7280' },
  { name: 'In Progress', color: '#3B82F6' },
  { name: 'Review', color: '#F59E0B' },
  { name: 'Done', color: '#10B981' },
];

// Task Card Component
function TaskCard({ task, isDragging }: { task: TaskWithAssignee; isDragging?: boolean }) {
  return (
    <div
      className={`
        bg-dark-pure/80 border border-brand-green/10 rounded-lg p-3
        hover:border-brand-green/30 transition-colors
        ${isDragging ? 'shadow-lg ring-2 ring-brand-green/50' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-light-DEFAULT line-clamp-2">
          {task.title}
        </h4>
        <button className="text-text-muted hover:text-text-light p-1 -mr-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.priority && (
            <span
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {task.priority}
            </span>
          )}
          {task.due_date && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.due_date), 'MMM d')}
            </span>
          )}
        </div>

        {task.assignee && (
          <div className="flex items-center">
            {task.assignee.avatar_url ? (
              <Image
                src={task.assignee.avatar_url}
                alt={task.assignee.full_name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center">
                <span className="text-[10px] text-brand-green font-medium">
                  {task.assignee.full_name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Sortable Task Component
function SortableTask({ task }: { task: TaskWithAssignee }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}

// Column Component
function Column({
  column,
  onAddTask,
}: {
  column: ColumnWithTasks;
  onAddTask: (columnId: string) => void;
}) {
  return (
    <div className="flex-shrink-0 w-72 bg-dark-card/50 rounded-xl">
      <div className="flex items-center justify-between p-3 border-b border-brand-green/10">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color || '#6B7280' }}
          />
          <h3 className="text-sm font-medium text-light-DEFAULT">{column.name}</h3>
          <span className="text-xs text-text-muted bg-dark-pure/50 px-1.5 py-0.5 rounded">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 text-text-muted hover:text-brand-green transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto">
          {column.tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// Add Task Modal
function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  columnId,
  members,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => void;
  columnId: string;
  members: { profile_id: string; profile?: Profile }[];
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssigneeId('');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
      <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-light-DEFAULT">Add Task</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-light p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Title <span className="text-accent-coral">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              required
              className="w-full px-4 py-2.5 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted
                       focus:outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-2.5 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT focus:outline-none focus:border-brand-green"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT focus:outline-none focus:border-brand-green"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.profile_id} value={m.profile_id}>
                    {m.profile?.full_name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT focus:outline-none focus:border-brand-green"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-green hover:bg-primary-dark
                     text-dark-pure font-semibold rounded-xl transition-colors"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { user } = useAuth();
  const { team, members } = useTeam();
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBoard = useCallback(async () => {
    if (!team) return;

    try {
      setLoading(true);

      // Fetch columns
      let { data: columnsData, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('team_id', team.id)
        .order('position');

      if (columnsError) throw columnsError;

      // If no columns exist, create default ones
      if (!columnsData || columnsData.length === 0) {
        const newColumns = DEFAULT_COLUMNS.map((col, index) => ({
          team_id: team.id,
          name: col.name,
          color: col.color,
          position: index,
        }));

        const { data: createdColumns, error: createError } = await supabase
          .from('kanban_columns')
          .insert(newColumns)
          .select();

        if (createError) throw createError;
        columnsData = createdColumns;
      }

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('kanban_tasks')
        .select(`
          *,
          assignee:profiles(*)
        `)
        .eq('team_id', team.id)
        .order('position');

      if (tasksError) throw tasksError;

      // Organize tasks into columns
      const columnsWithTasks: ColumnWithTasks[] = (columnsData || []).map(
        (col: KanbanColumn) => ({
          ...col,
          tasks: (tasksData || []).filter((t) => t.column_id === col.id),
        })
      );

      setColumns(columnsWithTasks);
    } catch (error) {
      console.error('Error fetching board:', error);
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [team, supabase]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = columns.flatMap((c) => c.tasks).find((t) => t.id === active.id);
    if (!activeTask) return;

    // Find destination column
    let destColumnId: string | null = null;

    // Check if dropped on a column
    const destColumn = columns.find((c) => c.id === over.id);
    if (destColumn) {
      destColumnId = destColumn.id;
    } else {
      // Dropped on a task, find its column
      const overTask = columns.flatMap((c) => c.tasks).find((t) => t.id === over.id);
      if (overTask) {
        destColumnId = overTask.column_id;
      }
    }

    if (!destColumnId || destColumnId === activeTask.column_id) return;

    // Update in database
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .update({ column_id: destColumnId })
        .eq('id', activeTask.id);

      if (error) throw error;

      // Update local state
      setColumns((prev) =>
        prev.map((col: KanbanColumn) => ({
          ...col,
          tasks:
            col.id === activeTask.column_id
              ? col.tasks.filter((t) => t.id !== activeTask.id)
              : col.id === destColumnId
              ? [...col.tasks, { ...activeTask, column_id: destColumnId }]
              : col.tasks,
        }))
      );

      toast.success('Task moved');
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    }
  };

  const handleAddTask = async (data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => {
    if (!team || !selectedColumnId) return;

    try {
      const column = columns.find((c) => c.id === selectedColumnId);
      const position = column ? column.tasks.length : 0;

      const { data: newTask, error } = await supabase
        .from('kanban_tasks')
        .insert({
          team_id: team.id,
          column_id: selectedColumnId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          assignee_id: data.assigneeId,
          due_date: data.dueDate,
          position,
        })
        .select(`*, assignee:profiles(*)`)
        .single();

      if (error) throw error;

      setColumns((prev) =>
        prev.map((col) =>
          col.id === selectedColumnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      );

      toast.success('Task created');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const openAddModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-dark-card/50 rounded w-48 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-96 bg-dark-card/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT">Project Board</h1>
          <p className="text-text-muted text-sm mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => (
              <Column key={column.id} column={column} onAddTask={openAddModal} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        columnId={selectedColumnId}
        members={members}
      />
    </div>
  );
}
