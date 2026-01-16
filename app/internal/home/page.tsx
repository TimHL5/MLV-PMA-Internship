'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardStats {
  totalInterns: number;
  submittedThisSprint: number;
  missingSubmissions: number;
  totalSubmissions: number;
  highFivesGiven: number;
  tasksCompleted: number;
  averageMood: number | null;
}

interface SubmissionStatus {
  intern: {
    id: number;
    name: string;
    avatar_url: string | null;
    location: string | null;
  };
  hasSubmitted: boolean;
  submittedAt: string | null;
}

interface HighFive {
  id: number;
  from_intern_name: string;
  to_intern_name: string;
  message: string;
  category: string | null;
  created_at: string;
}

interface CoffeeChat {
  id: number;
  status: string;
  intern_1_name: string;
  intern_1_location: string | null;
  intern_1_timezone: string | null;
  intern_2_name: string;
  intern_2_location: string | null;
  intern_2_timezone: string | null;
}

// Stagger animation for children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
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

// Card hover effect
const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

// Skeleton loading component
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
  color,
  href,
  icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  color: string;
  href?: string;
  icon?: React.ReactNode;
  delay?: number;
}) {
  const content = (
    <>
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color}/5 to-transparent`} />

      {/* Top row with icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-text-muted/70 text-sm font-medium">{label}</p>
        {icon && (
          <div className={`w-8 h-8 rounded-lg ${color}/10 flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className={`text-3xl font-bold ${color} tracking-tight`}>{value}</p>

      {/* Decorative corner */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${color}/5 blur-2xl`} />
    </>
  );

  const baseClassName = `relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-5 group ${href ? 'cursor-pointer' : ''}`;

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={cardHover}
        whileTap={{ scale: 0.98 }}
      >
        <Link href={href} className={`block ${baseClassName}`}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={baseClassName}
    >
      {content}
    </motion.div>
  );
}

// Quick action card
function QuickActionCard({
  href,
  icon,
  title,
  subtitle,
  color,
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href} className="block group">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden flex items-center gap-4 p-4 bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl"
        >
          {/* Icon container */}
          <div className={`w-12 h-12 rounded-xl ${color}/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-text-light font-medium group-hover:text-white transition-colors">{title}</p>
            <p className="text-text-muted/60 text-sm">{subtitle}</p>
          </div>

          {/* Arrow */}
          <svg className="w-5 h-5 text-text-muted/40 group-hover:text-text-light group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const { currentUser, activeSprint } = usePortal();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus[]>([]);
  const [recentHighFives, setRecentHighFives] = useState<HighFive[]>([]);
  const [myCoffeeChat, setMyCoffeeChat] = useState<CoffeeChat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeSprint) {
      fetchDashboardData();
    }
  }, [activeSprint, currentUser]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, statusRes, highFivesRes] = await Promise.all([
        fetch(`/api/internal/dashboard/stats?sprintId=${activeSprint?.id}`),
        fetch(`/api/internal/dashboard/status?sprintId=${activeSprint?.id}`),
        fetch('/api/internal/high-fives?limit=5'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (statusRes.ok) setSubmissionStatus(await statusRes.json());
      if (highFivesRes.ok) setRecentHighFives(await highFivesRes.json());

      if (currentUser && activeSprint) {
        const coffeeChatRes = await fetch(
          `/api/internal/coffee-chats?internId=${currentUser.id}&sprintId=${activeSprint.id}`
        );
        if (coffeeChatRes.ok) {
          const coffeeChats = await coffeeChatRes.json();
          setMyCoffeeChat(coffeeChats[0] || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilEnd = () => {
    if (!activeSprint?.end_date) return null;
    const endDate = new Date(activeSprint.end_date);
    const today = new Date();
    const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysUntilEnd();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const submittedCount = submissionStatus.filter(s => s.hasSubmitted).length;
  const totalCount = submissionStatus.length;
  const progressPercent = totalCount > 0 ? (submittedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28" />
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
      className="space-y-8 pb-20 lg:pb-0"
    >
      {/* Welcome header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            {currentUser ? (
              <>
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-brand-green to-brand-yellow bg-clip-text text-transparent">
                  {currentUser.name.split(' ')[0]}
                </span>
              </>
            ) : (
              'Welcome'
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted/70 mt-2 flex items-center gap-3"
          >
            <span>{activeSprint?.name || 'No active sprint'}</span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-yellow/10 text-brand-yellow text-xs font-medium rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                {daysLeft} days left
              </span>
            )}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/internal/submit"
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-green to-brand-green/80 hover:from-brand-green hover:to-brand-green text-dark-pure font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 hover:shadow-xl"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Update
          </Link>
        </motion.div>
      </motion.div>

      {/* Sprint Status Board */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Sprint Status</h2>
              <p className="text-text-muted/60 text-sm mt-1">Track team progress this sprint</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{submittedCount}<span className="text-text-muted/50">/{totalCount}</span></p>
                <p className="text-xs text-text-muted/60">Submitted</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" className="stroke-white/5" strokeWidth="3" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-brand-green"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent}, 100`}
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${progressPercent}, 100` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-brand-green">{Math.round(progressPercent)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-green via-brand-green to-brand-yellow"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Intern status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <AnimatePresence>
              {submissionStatus.map((status, index) => (
                <motion.div
                  key={status.intern.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200
                    ${status.hasSubmitted
                      ? 'bg-brand-green/10 border-brand-green/20 hover:border-brand-green/40'
                      : 'bg-white/5 border-white/5 hover:border-accent-coral/30'
                    }
                  `}
                >
                  <motion.div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${status.hasSubmitted ? 'bg-brand-green' : 'bg-accent-coral'}`}
                    animate={status.hasSubmitted ? {} : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`text-sm truncate ${status.hasSubmitted ? 'text-brand-green' : 'text-text-muted/70'}`}>
                    {status.intern.name.split(' ')[0]}
                  </span>
                  {status.hasSubmitted && (
                    <svg className="w-3.5 h-3.5 text-brand-green ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Missing summary */}
          {submissionStatus.filter(s => !s.hasSubmitted).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-white/5"
            >
              <p className="text-sm">
                <span className="text-accent-coral/80 font-medium">Still waiting: </span>
                <span className="text-text-muted/60">
                  {submissionStatus
                    .filter(s => !s.hasSubmitted)
                    .map(s => s.intern.name.split(' ')[0])
                    .join(', ')}
                </span>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Submissions"
            value={stats.totalSubmissions}
            color="text-white"
            href="/internal/me"
            delay={0.1}
            icon={
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="High Fives"
            value={stats.highFivesGiven}
            color="text-brand-yellow"
            href="/internal/team"
            delay={0.15}
            icon={<span className="text-lg">🙌</span>}
          />
          <StatCard
            label="Tasks Done"
            value={stats.tasksCompleted}
            color="text-brand-green"
            href="/internal/board"
            delay={0.2}
            icon={
              <svg className="w-4 h-4 text-brand-green/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Team Mood"
            value={stats.averageMood ? `${stats.averageMood.toFixed(1)}/5` : '--'}
            color="text-accent-teal"
            delay={0.25}
            icon={<span className="text-lg">😊</span>}
          />
        </div>
      )}

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coffee Chat Card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">☕</span>
              <div>
                <h2 className="text-lg font-semibold text-white">Coffee Chat</h2>
                <p className="text-text-muted/60 text-xs">This week&apos;s connection</p>
              </div>
            </div>

            {myCoffeeChat ? (
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/5"
                >
                  <p className="text-text-muted/60 text-xs mb-3">You&apos;re paired with</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-green/30 to-brand-yellow/30 flex items-center justify-center text-brand-green font-semibold text-xl ring-2 ring-brand-green/20">
                      {(myCoffeeChat.intern_1_name === currentUser?.name
                        ? myCoffeeChat.intern_2_name
                        : myCoffeeChat.intern_1_name
                      ).charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">
                        {myCoffeeChat.intern_1_name === currentUser?.name
                          ? myCoffeeChat.intern_2_name
                          : myCoffeeChat.intern_1_name}
                      </p>
                      <p className="text-text-muted/60 text-sm flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {myCoffeeChat.intern_1_name === currentUser?.name
                          ? myCoffeeChat.intern_2_location
                          : myCoffeeChat.intern_1_location}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={async () => {
                    await fetch(`/api/internal/coffee-chats/${myCoffeeChat.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'completed' }),
                    });
                    fetchDashboardData();
                  }}
                  disabled={myCoffeeChat.status === 'completed'}
                  whileHover={myCoffeeChat.status !== 'completed' ? { scale: 1.02 } : {}}
                  whileTap={myCoffeeChat.status !== 'completed' ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    myCoffeeChat.status === 'completed'
                      ? 'bg-brand-green/20 text-brand-green cursor-default'
                      : 'bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green/20'
                  }`}
                >
                  {myCoffeeChat.status === 'completed' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Chat Completed
                    </span>
                  ) : 'Mark as Complete'}
                </motion.button>

                <p className="text-text-muted/50 text-xs flex items-center gap-1.5">
                  <span className="text-brand-yellow">💡</span>
                  Topics: weekend plans, podcasts, what you&apos;re learning
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-3xl opacity-50">☕</span>
                </div>
                <p className="text-text-muted/60 mb-4">No coffee chat assigned yet</p>
                {currentUser?.role === 'admin' && (
                  <Link
                    href="/internal/admin"
                    className="inline-flex items-center gap-2 text-brand-green text-sm hover:underline"
                  >
                    Generate pairings
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent High Fives */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🙌</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">Recent High Fives</h2>
                  <p className="text-text-muted/60 text-xs">Team recognition</p>
                </div>
              </div>
              <Link href="/internal/team" className="text-brand-green text-sm hover:text-brand-green/80 flex items-center gap-1 group">
                View all
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {recentHighFives.length > 0 ? (
              <div className="space-y-3">
                {recentHighFives.map((hf, index) => (
                  <motion.div
                    key={hf.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 hover:bg-white/[0.07] rounded-xl p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-brand-yellow font-medium">{hf.from_intern_name.split(' ')[0]}</span>
                          <span className="text-text-muted/40 mx-2">→</span>
                          <span className="text-brand-green font-medium">{hf.to_intern_name.split(' ')[0]}</span>
                        </p>
                        <p className="text-text-muted/60 text-sm mt-1 line-clamp-2">{hf.message}</p>
                      </div>
                      <span className="text-text-muted/40 text-xs whitespace-nowrap">{formatTimeAgo(hf.created_at)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-3xl opacity-50">🙌</span>
                </div>
                <p className="text-text-muted/60 mb-4">No high fives yet</p>
                <Link
                  href="/internal/team"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-yellow/10 text-brand-yellow rounded-xl text-sm font-medium hover:bg-brand-yellow/20 transition-colors"
                >
                  Give a High Five
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            href="/internal/one-on-one"
            title="1:1 Prep"
            subtitle="Prepare for your call"
            color="bg-accent-teal"
            delay={0.1}
            icon={
              <svg className="w-6 h-6 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <QuickActionCard
            href="/internal/board"
            title="Sprint Board"
            subtitle="View tasks"
            color="bg-accent-purple"
            delay={0.15}
            icon={
              <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <QuickActionCard
            href="/internal/team"
            title="High Five"
            subtitle="Recognize a teammate"
            color="bg-brand-yellow"
            delay={0.2}
            icon={<span className="text-2xl">🙌</span>}
          />
          <QuickActionCard
            href="/internal/me"
            title="My Progress"
            subtitle="View your stats"
            color="bg-brand-green"
            delay={0.25}
            icon={
              <svg className="w-6 h-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
