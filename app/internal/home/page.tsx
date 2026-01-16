'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';

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

export default function HomePage() {
  const { currentUser, activeSprint, interns } = usePortal();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus[]>([]);
  const [recentHighFives, setRecentHighFives] = useState<HighFive[]>([]);
  const [myCoffeeChat, setMyCoffeeChat] = useState<CoffeeChat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeSprint) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSprint, currentUser]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, statusRes, highFivesRes] = await Promise.all([
        fetch(`/api/internal/dashboard/stats?sprintId=${activeSprint?.id}`),
        fetch(`/api/internal/dashboard/status?sprintId=${activeSprint?.id}`),
        fetch('/api/internal/high-fives?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSubmissionStatus(statusData);
      }

      if (highFivesRes.ok) {
        const highFivesData = await highFivesRes.json();
        setRecentHighFives(highFivesData);
      }

      // Get coffee chat for current user
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
      <div className="space-y-6">
        {/* Skeleton loading */}
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-dark-card/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT">
            {currentUser ? `Welcome, ${currentUser.name.split(' ')[0]}` : 'Welcome'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {activeSprint?.name || 'No active sprint'}
            {daysLeft !== null && daysLeft > 0 && (
              <span className="ml-2 text-brand-yellow">({daysLeft} days left)</span>
            )}
          </p>
        </div>
        <Link
          href="/internal/submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5
                   bg-brand-green hover:bg-primary-dark text-dark-pure font-medium rounded-xl
                   transition-all duration-200 shadow-glow-green hover:shadow-glow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit Update
        </Link>
      </div>

      {/* Who's Missing Board - Feature 4 */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-light-DEFAULT">
            Sprint Status
          </h2>
          <span className="text-sm text-text-muted">
            {submittedCount}/{totalCount} Submitted ({Math.round(progressPercent)}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-dark-pure rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-brand-green to-primary-light transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Intern status grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {submissionStatus.map((status) => (
            <div
              key={status.intern.id}
              className={`
                flex items-center gap-2 p-3 rounded-lg border
                ${status.hasSubmitted
                  ? 'bg-brand-green/10 border-brand-green/30'
                  : 'bg-accent-coral/10 border-accent-coral/30'
                }
              `}
            >
              <div className={`
                w-2 h-2 rounded-full flex-shrink-0
                ${status.hasSubmitted ? 'bg-brand-green' : 'bg-accent-coral'}
              `} />
              <span className={`
                text-sm truncate
                ${status.hasSubmitted ? 'text-brand-green' : 'text-accent-coral'}
              `}>
                {status.intern.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Missing list */}
        {submissionStatus.filter(s => !s.hasSubmitted).length > 0 && (
          <div className="mt-4 pt-4 border-t border-brand-green/10">
            <p className="text-text-muted text-sm">
              <span className="text-accent-coral font-medium">Missing: </span>
              {submissionStatus
                .filter(s => !s.hasSubmitted)
                .map(s => s.intern.name.split(' ')[0])
                .join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/internal/me"
            className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 hover:border-brand-green/40 transition-colors"
          >
            <p className="text-text-muted text-sm mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-light-DEFAULT">{stats.totalSubmissions}</p>
          </Link>
          <Link
            href="/internal/team"
            className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 hover:border-brand-green/40 transition-colors"
          >
            <p className="text-text-muted text-sm mb-1">High Fives</p>
            <p className="text-3xl font-bold text-brand-yellow">{stats.highFivesGiven}</p>
          </Link>
          <Link
            href="/internal/board"
            className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 hover:border-brand-green/40 transition-colors"
          >
            <p className="text-text-muted text-sm mb-1">Tasks Done</p>
            <p className="text-3xl font-bold text-brand-green">{stats.tasksCompleted}</p>
          </Link>
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Team Mood</p>
            <p className="text-3xl font-bold text-accent-teal">
              {stats.averageMood ? `${stats.averageMood.toFixed(1)}/5` : '--'}
            </p>
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coffee Chat Card - Feature 5 */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">☕</span>
            <h2 className="text-lg font-semibold text-light-DEFAULT">This Week&apos;s Coffee Chat</h2>
          </div>

          {myCoffeeChat ? (
            <div className="space-y-4">
              <div className="bg-dark-pure/50 rounded-lg p-4">
                <p className="text-text-muted text-sm mb-2">You&apos;re paired with:</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-medium text-lg">
                    {(myCoffeeChat.intern_1_name === currentUser?.name
                      ? myCoffeeChat.intern_2_name
                      : myCoffeeChat.intern_1_name
                    ).charAt(0)}
                  </div>
                  <div>
                    <p className="text-light-DEFAULT font-medium">
                      {myCoffeeChat.intern_1_name === currentUser?.name
                        ? myCoffeeChat.intern_2_name
                        : myCoffeeChat.intern_1_name}
                    </p>
                    <p className="text-text-muted text-sm">
                      {myCoffeeChat.intern_1_name === currentUser?.name
                        ? myCoffeeChat.intern_2_location
                        : myCoffeeChat.intern_1_location}
                      {' • '}
                      {myCoffeeChat.intern_1_name === currentUser?.name
                        ? myCoffeeChat.intern_2_timezone
                        : myCoffeeChat.intern_1_timezone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await fetch(`/api/internal/coffee-chats/${myCoffeeChat.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'completed' }),
                    });
                    fetchDashboardData();
                  }}
                  disabled={myCoffeeChat.status === 'completed'}
                  className={`
                    flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                    ${myCoffeeChat.status === 'completed'
                      ? 'bg-brand-green/20 text-brand-green cursor-default'
                      : 'bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green/20'
                    }
                  `}
                >
                  {myCoffeeChat.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>

              <p className="text-text-muted text-xs">
                💡 Topics: weekend plans, podcasts, what you&apos;re learning
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-muted">No coffee chat assigned yet</p>
              {currentUser?.role === 'admin' && (
                <Link
                  href="/internal/admin"
                  className="inline-block mt-3 text-brand-green text-sm hover:underline"
                >
                  Generate pairings →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent High Fives - Feature 1 */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙌</span>
              <h2 className="text-lg font-semibold text-light-DEFAULT">Recent High Fives</h2>
            </div>
            <Link
              href="/internal/team"
              className="text-brand-green text-sm hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentHighFives.length > 0 ? (
            <div className="space-y-3">
              {recentHighFives.map((hf) => (
                <div key={hf.id} className="bg-dark-pure/50 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-text-light text-sm">
                        <span className="text-brand-yellow font-medium">{hf.from_intern_name.split(' ')[0]}</span>
                        {' → '}
                        <span className="text-brand-green font-medium">{hf.to_intern_name.split(' ')[0]}</span>
                      </p>
                      <p className="text-text-muted text-sm mt-1 line-clamp-2">{hf.message}</p>
                    </div>
                    <span className="text-text-muted text-xs whitespace-nowrap">
                      {formatTimeAgo(hf.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-muted mb-3">No high fives yet</p>
              <Link
                href="/internal/team"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow rounded-lg text-sm hover:bg-brand-yellow/20 transition-colors"
              >
                Give a High Five
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/internal/one-on-one"
          className="flex items-center gap-3 p-4 bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl hover:border-brand-green/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-teal/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-light-DEFAULT text-sm font-medium">1:1 Prep</p>
            <p className="text-text-muted text-xs">Prepare for your call</p>
          </div>
        </Link>

        <Link
          href="/internal/board"
          className="flex items-center gap-3 p-4 bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl hover:border-brand-green/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-light-DEFAULT text-sm font-medium">Sprint Board</p>
            <p className="text-text-muted text-xs">View tasks</p>
          </div>
        </Link>

        <Link
          href="/internal/team"
          className="flex items-center gap-3 p-4 bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl hover:border-brand-green/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-yellow/20 flex items-center justify-center">
            <span className="text-lg">🙌</span>
          </div>
          <div>
            <p className="text-light-DEFAULT text-sm font-medium">High Five</p>
            <p className="text-text-muted text-xs">Recognize a teammate</p>
          </div>
        </Link>

        <Link
          href="/internal/me"
          className="flex items-center gap-3 p-4 bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl hover:border-brand-green/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-light-DEFAULT text-sm font-medium">My Progress</p>
            <p className="text-text-muted text-xs">View your stats</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
