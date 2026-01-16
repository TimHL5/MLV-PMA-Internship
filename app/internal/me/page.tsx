'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HighFive {
  id: number;
  from_intern_name: string;
  message: string;
  category: string | null;
  created_at: string;
}

interface SubmissionHistory {
  sprint: {
    id: number;
    name: string;
    start_date: string | null;
    end_date: string | null;
  };
  submitted: boolean;
  submittedAt: string | null;
}

interface InternProgress {
  intern: {
    id: number;
    name: string;
    email: string | null;
    location: string | null;
  };
  totalSubmissions: number;
  currentStreak: number;
  highFivesReceived: number;
  averageMood: number | null;
  tasksCompleted: number;
  submissionHistory: SubmissionHistory[];
  recentHighFives: HighFive[];
}

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

// Stat card component
function StatCard({
  label,
  value,
  icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-5 group"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color}/5 to-transparent`} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-text-muted/70 text-sm">{label}</p>
        </div>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
          className={`text-3xl font-bold ${color}`}
        >
          {value}
        </motion.p>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${color}/5 blur-2xl`} />
    </motion.div>
  );
}

export default function MyProgressPage() {
  const { currentUser } = usePortal();
  const [progress, setProgress] = useState<InternProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/internal/me?internId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch {
      console.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-green/20 to-brand-green/5 flex items-center justify-center mb-6"
        >
          <svg className="w-10 h-10 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-semibold text-white mb-3">Select Your Profile</h2>
        <p className="text-text-muted/70 text-center max-w-md leading-relaxed">
          Please select yourself from the dropdown in the sidebar to view your progress and stats.
        </p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20 lg:pb-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-5">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-green/30 to-brand-yellow/30 flex items-center justify-center text-brand-green font-bold text-3xl ring-4 ring-brand-green/20"
        >
          {currentUser.name.charAt(0).toUpperCase()}
        </motion.div>
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            My Progress
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted/70 mt-1 flex items-center gap-2"
          >
            {currentUser.name}
            {progress?.intern.location && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {progress.intern.location}
                </span>
              </>
            )}
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {progress && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Submissions"
            value={progress.totalSubmissions}
            color="text-white"
            delay={0.1}
            icon={
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="Streak"
            value={progress.currentStreak}
            color="text-brand-yellow"
            delay={0.15}
            icon={<span className="text-lg">🔥</span>}
          />
          <StatCard
            label="High 5s"
            value={progress.highFivesReceived}
            color="text-brand-green"
            delay={0.2}
            icon={<span className="text-lg">🙌</span>}
          />
          <StatCard
            label="Avg Mood"
            value={progress.averageMood ? progress.averageMood.toFixed(1) : '--'}
            color="text-accent-teal"
            delay={0.25}
            icon={<span className="text-lg">😊</span>}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submission History */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-lg font-semibold text-white mb-5">Submission History</h2>

            {progress && progress.submissionHistory.length > 0 ? (
              <div className="space-y-2">
                {progress.submissionHistory.slice(0, 8).map((sh, index) => {
                  const isCurrent = index === 0;
                  const status = sh.submitted ? 'submitted' : isCurrent ? 'pending' : 'missed';

                  return (
                    <motion.div
                      key={sh.sprint.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        status === 'submitted'
                          ? 'bg-brand-green/10 border-brand-green/20'
                          : status === 'pending'
                            ? 'bg-brand-yellow/10 border-brand-yellow/20'
                            : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            status === 'submitted'
                              ? 'bg-brand-green/20'
                              : status === 'pending'
                                ? 'bg-brand-yellow/20'
                                : 'bg-white/5'
                          }`}
                        >
                          {status === 'submitted' ? (
                            <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : status === 'pending' ? (
                            <svg className="w-4 h-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </motion.div>

                        <div>
                          <p className="text-text-light text-sm font-medium flex items-center gap-2">
                            {sh.sprint.name}
                            {isCurrent && !sh.submitted && (
                              <span className="px-2 py-0.5 bg-brand-yellow/20 text-brand-yellow text-[10px] font-semibold rounded-full uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </p>
                          {sh.sprint.start_date && (
                            <p className="text-text-muted/50 text-xs mt-0.5">
                              {formatDate(sh.sprint.start_date)}
                              {sh.sprint.end_date && ` - ${formatDate(sh.sprint.end_date)}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className={`text-sm ${
                        status === 'submitted' ? 'text-brand-green' : status === 'pending' ? 'text-brand-yellow' : 'text-text-muted/40'
                      }`}>
                        {sh.submitted && sh.submittedAt
                          ? formatDate(sh.submittedAt)
                          : isCurrent
                            ? 'Pending'
                            : 'Missed'
                        }
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  📝
                </motion.div>
                <p className="text-text-muted/70 mb-4">No submission history yet</p>
                <Link
                  href="/internal/submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-dark-pure font-medium rounded-xl hover:bg-brand-green/90 transition-colors"
                >
                  Submit Your First Update
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent High Fives Received */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">High Fives Received</h2>
              <Link href="/internal/team" className="text-brand-green text-sm hover:text-brand-green/80 flex items-center gap-1 group">
                View all
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {progress && progress.recentHighFives.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {progress.recentHighFives.map((hf, index) => (
                    <motion.div
                      key={hf.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 hover:bg-white/[0.07] rounded-xl p-4 border border-white/5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <motion.span
                            className="text-2xl"
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          >
                            🙌
                          </motion.span>
                          <span className="text-brand-yellow font-medium text-sm">
                            From {hf.from_intern_name.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-text-muted/40 text-xs">
                          {formatTimeAgo(hf.created_at)}
                        </span>
                      </div>
                      <p className="text-text-light/80 text-sm leading-relaxed pl-10">{hf.message}</p>
                      {hf.category && (
                        <span className="inline-block ml-10 mt-3 px-2.5 py-1 bg-brand-green/10 text-brand-green text-xs rounded-lg font-medium">
                          {hf.category}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🙌
                </motion.div>
                <p className="text-text-muted/70">No high fives received yet</p>
                <p className="text-text-muted/50 text-sm mt-1">Keep up the great work!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity Overview */}
      {progress && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-5">Activity Overview</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: progress.tasksCompleted, label: 'Tasks Completed', color: 'text-brand-green', icon: '✅' },
              { value: progress.currentStreak, label: 'Week Streak', color: 'text-brand-yellow', icon: '🔥' },
              { value: progress.highFivesReceived, label: 'Recognition', color: 'text-accent-teal', icon: '⭐' },
              { value: progress.totalSubmissions, label: 'Updates', color: 'text-accent-purple', icon: '📊' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.1, type: 'spring' }}
                  className={`text-2xl font-bold ${item.color}`}
                >
                  {item.value}
                </motion.p>
                <p className="text-text-muted/60 text-sm mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
