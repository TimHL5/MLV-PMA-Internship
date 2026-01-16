'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

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
  { id: 'todo', label: 'To Do', color: 'text-text-muted/80', bgColor: 'bg-white/5', iconColor: 'text-text-muted/60' },
  { id: 'in_progress', label: 'In Progress', color: 'text-brand-yellow', bgColor: 'bg-brand-yellow/5', iconColor: 'text-brand-yellow' },
  { id: 'review', label: 'Review', color: 'text-accent-purple', bgColor: 'bg-accent-purple/5', iconColor: 'text-accent-purple' },
  { id: 'done', label: 'Done', color: 'text-brand-green', bgColor: 'bg-brand-green/5', iconColor: 'text-brand-green' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-text-muted/20 text-text-muted/80', ring: 'ring-text-muted/20' },
  { value: 'medium', label: 'Medium', color: 'bg-brand-yellow/20 text-brand-yellow', ring: 'ring-brand-yellow/20' },
  { value: 'high', label: 'High', color: 'bg-accent-coral/20 text-accent-coral', ring: 'ring-accent-coral/20' },
  { value: 'urgent', label: 'Urgent', color: 'bg-accent-coral text-white', ring: 'ring-accent-coral' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

// Task Card component
function TaskCard({
  task,
  onDragStart,
  onClick,
  isDragging,
}: {
  task: Task;
  onDragStart: () => void;
  onClick: () => void;
  isDragging: boolean;
}) {
  const priorityStyle = PRIORITIES.find(p => p.value === task.priority);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: 'Overdue', class: 'text-accent-coral' };
    if (diff === 0) return { text: 'Today', class: 'text-brand-yellow' };
    if (diff === 1) return { text: 'Tomorrow', class: 'text-brand-yellow' };
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), class: 'text-text-muted/60' };
  };

  const dueInfo = formatDate(task.due_date);

  return (
    <motion.div
      layout
      layoutId={`task-${task.id}`}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-gradient-to-br from-dark-card/90 to-dark-card/60 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-white/10 transition-all duration-200 ${isDragging ? 'shadow-2xl z-50' : 'shadow-lg'}`}
    >
      {/* Priority indicator line */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${priorityStyle?.color.split(' ')[0] || 'bg-white/20'}`} />

      {/* Priority badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${priorityStyle?.color}`}>
          {task.priority}
        </span>
        {task.status === 'done' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-text-light font-medium text-sm mb-3 line-clamp-2 group-hover:text-white transition-colors">
        {task.title}
      </h4>

      {/* Meta */}
      <div className="flex items-center justify-between">
        {task.assignee_name ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-green/30 to-brand-green/10 flex items-center justify-center text-brand-green text-xs font-medium ring-1 ring-brand-green/20">
              {task.assignee_name.charAt(0)}
            </div>
            <span className="text-text-muted/70 text-xs truncate max-w-[60px]">
              {task.assignee_name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-text-muted/40 text-xs">Unassigned</span>
        )}

        {dueInfo && (
          <span className={`text-xs flex items-center gap-1 ${dueInfo.class}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dueInfo.text}
          </span>
        )}
      </div>
    </motion.div>
  );
}

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
  }, [activeSprint]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/internal/tasks?sprintId=${activeSprint?.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch {
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
    } catch {
      console.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t));

    try {
      await fetch(`/api/internal/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revert on error
      fetchTasks();
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
    } catch {
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
    } catch {
      console.error('Failed to add comment');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await fetch(`/api/internal/tasks/${taskId}`, { method: 'DELETE' });
      setSelectedTask(null);
      fetchTasks();
    } catch {
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

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20 lg:pb-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            Sprint Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted/70 mt-2"
          >
            {activeSprint?.name || 'No active sprint'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-text-muted/50 focus:outline-none focus:border-brand-green/50 w-44 transition-all"
            />
          </div>

          {/* Filter by assignee */}
          <select
            value={filter.assignee}
            onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-green/50 transition-all"
          >
            <option value="" className="bg-dark-card">All Assignees</option>
            {interns.map(intern => (
              <option key={intern.id} value={intern.id} className="bg-dark-card">{intern.name}</option>
            ))}
          </select>

          {/* Add task button */}
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-green to-brand-green/80 hover:from-brand-green hover:to-brand-green text-dark-pure font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column, colIndex) => {
          const columnTasks = getColumnTasks(column.id);
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className={`${column.bgColor} backdrop-blur-sm border border-white/5 rounded-2xl p-4 min-h-[450px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${column.color}`}>{column.label}</h3>
                  <motion.span
                    key={columnTasks.length}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-text-muted/50 text-xs bg-white/5 px-2 py-0.5 rounded-full"
                  >
                    {columnTasks.length}
                  </motion.span>
                </div>
                {column.id === 'done' && columnTasks.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-lg"
                  >
                    🎉
                  </motion.div>
                )}
              </div>

              {/* Tasks */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={() => handleDragStart(task)}
                      onClick={() => openTaskDetail(task)}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {/* Empty state */}
              {columnTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-32 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center mt-2"
                >
                  <p className="text-text-muted/40 text-sm">
                    {draggedTask ? 'Drop here' : 'No tasks'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-dark-pure/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-gradient-to-b from-dark-card to-dark-pure border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Task</h2>
                <motion.button
                  onClick={() => setShowAddModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-text-muted/60 hover:text-text-light p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-2">
                    Title <span className="text-accent-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    placeholder="Add more details..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 resize-none focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light/80 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green/50 transition-all"
                    >
                      {PRIORITIES.map(p => (
                        <option key={p.value} value={p.value} className="bg-dark-card">{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light/80 mb-2">
                      Assignee
                    </label>
                    <select
                      value={newTask.assigneeId}
                      onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green/50 transition-all"
                    >
                      <option value="" className="bg-dark-card">Unassigned</option>
                      {interns.map(intern => (
                        <option key={intern.id} value={intern.id} className="bg-dark-card">{intern.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-text-light hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!newTask.title}
                    whileHover={{ scale: newTask.title ? 1.02 : 1 }}
                    whileTap={{ scale: newTask.title ? 0.98 : 1 }}
                    className="flex-1 py-3 px-4 bg-brand-green text-dark-pure font-semibold rounded-xl hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Create Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-dark-pure/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-gradient-to-b from-dark-card to-dark-pure border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${PRIORITIES.find(p => p.value === selectedTask.priority)?.color}`}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </span>
                <motion.button
                  onClick={() => setSelectedTask(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-text-muted/60 hover:text-text-light p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <h2 className="text-xl font-bold text-white mb-4">{selectedTask.title}</h2>

              {selectedTask.description && (
                <p className="text-text-muted/70 text-sm mb-5 leading-relaxed">{selectedTask.description}</p>
              )}

              {/* Status selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text-light/80 mb-3">Status</label>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.map(col => (
                    <motion.button
                      key={col.id}
                      onClick={() => {
                        handleStatusChange(selectedTask.id, col.id);
                        setSelectedTask({ ...selectedTask, status: col.id as Task['status'] });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        selectedTask.status === col.id
                          ? 'bg-brand-green text-dark-pure font-medium'
                          : 'bg-white/5 border border-white/10 text-text-light hover:border-white/20'
                      }`}
                    >
                      {col.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-white/5 rounded-xl">
                <div>
                  <span className="text-text-muted/60 text-xs">Assignee</span>
                  <p className="text-text-light mt-1">{selectedTask.assignee_name || 'Unassigned'}</p>
                </div>
                {selectedTask.due_date && (
                  <div>
                    <span className="text-text-muted/60 text-xs">Due</span>
                    <p className="text-text-light mt-1">
                      {new Date(selectedTask.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="border-t border-white/5 pt-5">
                <h3 className="text-sm font-medium text-text-light/80 mb-4">Comments</h3>

                {taskComments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {taskComments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-brand-green text-sm font-medium">{comment.intern_name}</span>
                          <span className="text-text-muted/40 text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-light/80 text-sm">{comment.content}</p>
                      </motion.div>
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
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-text-muted/40 focus:outline-none focus:border-brand-green/50 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <motion.button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    whileHover={{ scale: newComment.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: newComment.trim() ? 0.95 : 1 }}
                    className="px-5 py-3 bg-brand-green text-dark-pure rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Send
                  </motion.button>
                </div>
              </div>

              {/* Delete button */}
              <motion.button
                onClick={() => handleDeleteTask(selectedTask.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 w-full py-3 text-accent-coral/80 text-sm hover:text-accent-coral hover:bg-accent-coral/10 rounded-xl transition-all"
              >
                Delete Task
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
