'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Professional Icons
const Icons = {
  document: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  handRaised: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l-.075 5.925m3.075-5.925v3.75a1.575 1.575 0 003.15 0V4.575m-3.15 4.5V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
    </svg>
  ),
  checkCircle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  face: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  coffee: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5m-7.5 3h5.25m-5.25 3h3m-9-9h13.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-10.5a2.25 2.25 0 012.25-2.25z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  mapPin: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  clipboard: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
};

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.03] rounded-2xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

// Stat card component
function StatCard({
  label,
  value,
  icon,
  href,
  accentColor = 'brand-green',
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href?: string;
  accentColor?: string;
  delay?: number;
}) {
  const content = (
    <div className="relative overflow-hidden h-full">
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${accentColor}/5 to-transparent`} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-white/50 text-sm font-medium">{label}</p>
          <div className={`w-10 h-10 rounded-xl bg-${accentColor}/10 flex items-center justify-center text-${accentColor}/70`}>
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );

  const baseClassName = `relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl group hover:border-white/[0.1] transition-all duration-300 ${href ? 'cursor-pointer' : ''}`;

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ y: -2 }}
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
  accentColor = 'brand-green',
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href} className="block group">
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden flex items-center gap-4 p-4 bg-[#111111] border border-white/[0.06] rounded-2xl hover:border-white/[0.1] transition-all duration-300"
        >
          <div className={`w-12 h-12 rounded-xl bg-${accentColor}/10 flex items-center justify-center text-${accentColor} group-hover:scale-105 transition-transform duration-200`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium group-hover:text-white transition-colors">{title}</p>
            <p className="text-white/40 text-sm">{subtitle}</p>
          </div>
          <div className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all">
            {Icons.chevronRight}
          </div>
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
          <div className="space-y-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
        <Skeleton className="h-56" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
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
            Welcome{currentUser && (
              <>
                {', '}
                <span className="text-brand-green">
                  {currentUser.name.split(' ')[0]}
                </span>
              </>
            )}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mt-2"
          >
            <span className="text-white/50">{activeSprint?.name || 'No active sprint'}</span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-green/10 text-brand-green text-xs font-medium rounded-full border border-brand-green/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                {daysLeft} days left
              </span>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/internal/submit"
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-green hover:bg-brand-green/90 text-[#0a0a0a] font-semibold rounded-xl transition-all duration-200"
          >
            <span className="group-hover:rotate-90 transition-transform duration-300">{Icons.plus}</span>
            Submit Update
          </Link>
        </motion.div>
      </motion.div>

      {/* Sprint Status Board */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl p-6"
      >
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Sprint Status</h2>
              <p className="text-white/40 text-sm mt-1">Track team progress this sprint</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{submittedCount}<span className="text-white/30">/{totalCount}</span></p>
                <p className="text-xs text-white/40">Submitted</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" className="stroke-white/[0.06]" strokeWidth="3" />
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
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-brand-green"
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200
                    ${status.hasSubmitted
                      ? 'bg-brand-green/5 border-brand-green/20'
                      : 'bg-white/[0.02] border-white/[0.06]'
                    }
                  `}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.hasSubmitted ? 'bg-brand-green' : 'bg-red-400/60'}`} />
                  <span className={`text-sm truncate ${status.hasSubmitted ? 'text-brand-green' : 'text-white/50'}`}>
                    {status.intern.name.split(' ')[0]}
                  </span>
                  {status.hasSubmitted && (
                    <span className="ml-auto text-brand-green">{Icons.check}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Missing summary */}
          {submissionStatus.filter(s => !s.hasSubmitted).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-white/[0.06]"
            >
              <p className="text-sm">
                <span className="text-red-400/80 font-medium">Still waiting: </span>
                <span className="text-white/40">
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
            icon={Icons.document}
            href="/internal/me"
            delay={0.1}
          />
          <StatCard
            label="High Fives"
            value={stats.highFivesGiven}
            icon={Icons.handRaised}
            href="/internal/team"
            accentColor="brand-yellow"
            delay={0.15}
          />
          <StatCard
            label="Tasks Done"
            value={stats.tasksCompleted}
            icon={Icons.checkCircle}
            href="/internal/board"
            delay={0.2}
          />
          <StatCard
            label="Team Mood"
            value={stats.averageMood ? `${stats.averageMood.toFixed(1)}/5` : '--'}
            icon={Icons.face}
            accentColor="accent-teal"
            delay={0.25}
          />
        </div>
      )}

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coffee Chat Card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              {Icons.coffee}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Coffee Chat</h2>
              <p className="text-white/40 text-xs">This week&apos;s connection</p>
            </div>
          </div>

          {myCoffeeChat ? (
            <div className="space-y-4">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <p className="text-white/40 text-xs mb-3">You&apos;re paired with</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-yellow/10 flex items-center justify-center text-brand-green font-semibold text-xl">
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
                    <p className="text-white/40 text-sm flex items-center gap-1.5">
                      {Icons.mapPin}
                      {myCoffeeChat.intern_1_name === currentUser?.name
                        ? myCoffeeChat.intern_2_location
                        : myCoffeeChat.intern_1_location}
                    </p>
                  </div>
                </div>
              </div>

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
                whileHover={myCoffeeChat.status !== 'completed' ? { scale: 1.01 } : {}}
                whileTap={myCoffeeChat.status !== 'completed' ? { scale: 0.99 } : {}}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  myCoffeeChat.status === 'completed'
                    ? 'bg-brand-green/10 text-brand-green cursor-default'
                    : 'bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green/20'
                }`}
              >
                {myCoffeeChat.status === 'completed' ? (
                  <span className="flex items-center justify-center gap-2">
                    {Icons.check}
                    Chat Completed
                  </span>
                ) : 'Mark as Complete'}
              </motion.button>

              <p className="text-white/30 text-xs flex items-center gap-1.5">
                <span className="text-brand-yellow">{Icons.lightbulb}</span>
                Topics: weekend plans, podcasts, what you&apos;re learning
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/20">
                {Icons.coffee}
              </div>
              <p className="text-white/40 mb-4">No coffee chat assigned yet</p>
              {currentUser?.role === 'admin' && (
                <Link
                  href="/internal/admin"
                  className="inline-flex items-center gap-2 text-brand-green text-sm hover:underline"
                >
                  Generate pairings
                  {Icons.chevronRight}
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Recent High Fives */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                {Icons.sparkles}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Recent High Fives</h2>
                <p className="text-white/40 text-xs">Team recognition</p>
              </div>
            </div>
            <Link href="/internal/team" className="text-brand-green text-sm hover:text-brand-green/80 flex items-center gap-1 group">
              View all
              <span className="group-hover:translate-x-0.5 transition-transform">{Icons.chevronRight}</span>
            </Link>
          </div>

          {recentHighFives.length > 0 ? (
            <div className="space-y-3">
              {recentHighFives.map((hf, index) => (
                <motion.div
                  key={hf.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3 transition-colors border border-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-brand-yellow font-medium">{hf.from_intern_name.split(' ')[0]}</span>
                        <span className="text-white/20 mx-2">{Icons.arrow}</span>
                        <span className="text-brand-green font-medium">{hf.to_intern_name.split(' ')[0]}</span>
                      </p>
                      <p className="text-white/50 text-sm mt-1 line-clamp-2">{hf.message}</p>
                    </div>
                    <span className="text-white/30 text-xs whitespace-nowrap">{formatTimeAgo(hf.created_at)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/20">
                {Icons.sparkles}
              </div>
              <p className="text-white/40 mb-4">No high fives yet</p>
              <Link
                href="/internal/team"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-yellow/10 text-brand-yellow rounded-xl text-sm font-medium hover:bg-brand-yellow/20 transition-colors"
              >
                Give a High Five
              </Link>
            </div>
          )}
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
            accentColor="accent-teal"
            delay={0.1}
            icon={Icons.calendar}
          />
          <QuickActionCard
            href="/internal/board"
            title="Sprint Board"
            subtitle="View tasks"
            accentColor="accent-purple"
            delay={0.15}
            icon={Icons.clipboard}
          />
          <QuickActionCard
            href="/internal/team"
            title="High Five"
            subtitle="Recognize a teammate"
            accentColor="brand-yellow"
            delay={0.2}
            icon={Icons.users}
          />
          <QuickActionCard
            href="/internal/me"
            title="My Progress"
            subtitle="View your stats"
            accentColor="brand-green"
            delay={0.25}
            icon={Icons.chart}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
