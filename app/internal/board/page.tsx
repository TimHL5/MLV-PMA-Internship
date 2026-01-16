'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';

interface Task {
  id: number;
  sprint_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: number | null;
  assignee_name: string | null;
  due_date: string | null;
  created_at: string;
}

interface TaskComment {
  id: number;
  intern_name: string;
  content: string;
  created_at: string;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'text-text-muted' },
  { id: 'in_progress', label: 'In Progress', color: 'text-brand-yellow' },
  { id: 'review', label: 'Review', color: 'text-accent-purple' },
  { id: 'done', label: 'Done', color: 'text-brand-green' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-text-muted/20 text-text-muted' },
  { value: 'medium', label: 'Medium', color: 'bg-brand-yellow/20 text-brand-yellow' },
  { value: 'high', label: 'High', color: 'bg-accent-coral/20 text-accent-coral' },
  { value: 'urgent', label: 'Urgent', color: 'bg-accent-coral text-light-DEFAULT' },
];

export default function BoardPage() {
  const { currentUser, activeSprint, interns } = usePortal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskComments, setTaskComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ assignee: '', search: '' });

  // Add task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
  });

  useEffect(() => {
    if (activeSprint) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSprint]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/internal/tasks?sprintId=${activeSprint?.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSprint || !newTask.title) return;

    try {
      const response = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprintId: activeSprint.id,
          title: newTask.title,
          description: newTask.description || undefined,
          priority: newTask.priority,
          assigneeId: newTask.assigneeId ? parseInt(newTask.assigneeId) : undefined,
          createdById: currentUser?.id,
          dueDate: newTask.dueDate || undefined,
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewTask({ title: '', description: '', priority: 'medium', assigneeId: '', dueDate: '' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await fetch(`/api/internal/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status');
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (draggedTask && draggedTask.status !== status) {
      await handleStatusChange(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  const openTaskDetail = async (task: Task) => {
    setSelectedTask(task);
    try {
      const response = await fetch(`/api/internal/tasks/${task.id}/comments`);
      if (response.ok) {
        const comments = await response.json();
        setTaskComments(comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !currentUser || !newComment.trim()) return;

    try {
      await fetch(`/api/internal/tasks/${selectedTask.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internId: currentUser.id,
          content: newComment,
        }),
      });
      setNewComment('');
      openTaskDetail(selectedTask);
    } catch (error) {
      console.error('Failed to add comment');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await fetch(`/api/internal/tasks/${taskId}`, { method: 'DELETE' });
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.assignee && task.assignee_id !== parseInt(filter.assignee)) return false;
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const getColumnTasks = (status: string) =>
    filteredTasks.filter(task => task.status === status);

  const getPriorityStyle = (priority: string) =>
    PRIORITIES.find(p => p.value === priority)?.color || '';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-dark-card/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-dark-card/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT">Sprint Board</h1>
          <p className="text-text-muted text-sm mt-1">
            {activeSprint?.name || 'No active sprint'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-3 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                     text-light-DEFAULT text-sm placeholder-text-muted
                     focus:outline-none focus:border-brand-green w-40"
          />

          {/* Filter by assignee */}
          <select
            value={filter.assignee}
            onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
            className="px-3 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                     text-light-DEFAULT text-sm
                     focus:outline-none focus:border-brand-green"
          >
            <option value="">All Assignees</option>
            {interns.map(intern => (
              <option key={intern.id} value={intern.id}>{intern.name}</option>
            ))}
          </select>

          {/* Add task button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2
                     bg-brand-green hover:bg-primary-dark text-dark-pure font-medium rounded-lg
                     transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className="bg-dark-card/50 rounded-xl p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${column.color}`}>
                {column.label}
              </h3>
              <span className="text-text-muted text-sm">
                {getColumnTasks(column.id).length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {getColumnTasks(column.id).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => openTaskDetail(task)}
                  className={`
                    bg-dark-pure/80 border border-brand-green/10 rounded-lg p-3 cursor-pointer
                    hover:border-brand-green/30 transition-all
                    ${draggedTask?.id === task.id ? 'opacity-50' : ''}
                  `}
                >
                  {/* Priority badge */}
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${getPriorityStyle(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>

                  {/* Title */}
                  <h4 className="text-light-DEFAULT text-sm font-medium mb-2 line-clamp-2">
                    {task.title}
                  </h4>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs">
                    {task.assignee_name && (
                      <div className="flex items-center gap-1 text-text-muted">
                        <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-xs">
                          {task.assignee_name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[80px]">
                          {task.assignee_name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                    {task.due_date && (
                      <span className="text-text-muted">
                        📅 {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-light-DEFAULT mb-6">Add New Task</h2>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Title <span className="text-accent-coral">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT resize-none focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                             text-light-DEFAULT focus:outline-none focus:border-brand-green"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Assignee
                  </label>
                  <select
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                             text-light-DEFAULT focus:outline-none focus:border-brand-green"
                  >
                    <option value="">Unassigned</option>
                    {interns.map(intern => (
                      <option key={intern.id} value={intern.id}>{intern.name}</option>
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
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-brand-green text-dark-pure font-semibold rounded-xl hover:bg-primary-dark"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityStyle(selectedTask.priority)}`}>
                {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-text-muted hover:text-text-light p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h2 className="text-xl font-bold text-light-DEFAULT mb-4">{selectedTask.title}</h2>

            {selectedTask.description && (
              <p className="text-text-muted text-sm mb-4">{selectedTask.description}</p>
            )}

            {/* Status selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-light mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {COLUMNS.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleStatusChange(selectedTask.id, col.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm transition-colors
                      ${selectedTask.status === col.id
                        ? 'bg-brand-green text-dark-pure'
                        : 'bg-dark-pure/50 border border-brand-green/30 text-text-light hover:border-brand-green/50'
                      }
                    `}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-text-muted">Assignee:</span>
                <p className="text-text-light">{selectedTask.assignee_name || 'Unassigned'}</p>
              </div>
              {selectedTask.due_date && (
                <div>
                  <span className="text-text-muted">Due:</span>
                  <p className="text-text-light">{formatDate(selectedTask.due_date)}</p>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="border-t border-brand-green/10 pt-4">
              <h3 className="text-sm font-medium text-text-light mb-3">Comments</h3>

              {taskComments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {taskComments.map(comment => (
                    <div key={comment.id} className="bg-dark-pure/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-brand-green text-sm font-medium">{comment.intern_name}</span>
                        <span className="text-text-muted text-xs">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-light text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                           text-light-DEFAULT text-sm placeholder-text-muted
                           focus:outline-none focus:border-brand-green"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-brand-green text-dark-pure rounded-lg text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDeleteTask(selectedTask.id)}
              className="mt-4 w-full py-2 text-accent-coral text-sm hover:bg-accent-coral/10 rounded-lg transition-colors"
            >
              Delete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
