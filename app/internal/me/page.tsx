'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/internal/me?internId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-light-DEFAULT mb-2">Select Your Profile</h2>
        <p className="text-text-muted text-center max-w-md">
          Please select yourself from the dropdown in the sidebar to view your progress.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-dark-card/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-dark-card/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-dark-card/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-2xl">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT">My Progress</h1>
          <p className="text-text-muted text-sm">
            {currentUser.name}
            {progress?.intern.location && ` • ${progress.intern.location}`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {progress && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Submissions</p>
            <p className="text-3xl font-bold text-light-DEFAULT">{progress.totalSubmissions}</p>
          </div>
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <p className="text-text-muted text-sm">Streak</p>
            </div>
            <p className="text-3xl font-bold text-brand-yellow">{progress.currentStreak}</p>
          </div>
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙌</span>
              <p className="text-text-muted text-sm">High 5s</p>
            </div>
            <p className="text-3xl font-bold text-brand-green">{progress.highFivesReceived}</p>
          </div>
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Avg Mood</p>
            <p className="text-3xl font-bold text-accent-teal">
              {progress.averageMood ? progress.averageMood.toFixed(1) : '--'}
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submission History */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4">Submission History</h2>

          {progress && progress.submissionHistory.length > 0 ? (
            <div className="space-y-2">
              {progress.submissionHistory.slice(0, 10).map((sh, index) => (
                <div
                  key={sh.sprint.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg
                    ${sh.submitted
                      ? 'bg-brand-green/10 border border-brand-green/20'
                      : index === 0
                        ? 'bg-brand-yellow/10 border border-brand-yellow/20'
                        : 'bg-accent-coral/10 border border-accent-coral/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`
                      text-lg
                      ${sh.submitted ? 'text-brand-green' : index === 0 ? 'text-brand-yellow' : 'text-accent-coral'}
                    `}>
                      {sh.submitted ? '✅' : index === 0 ? '⚠️' : '❌'}
                    </span>
                    <div>
                      <p className="text-light-DEFAULT text-sm font-medium">
                        {sh.sprint.name}
                        {index === 0 && !sh.submitted && (
                          <span className="ml-2 text-brand-yellow text-xs">(Current)</span>
                        )}
                      </p>
                      {sh.sprint.start_date && (
                        <p className="text-text-muted text-xs">
                          {formatDate(sh.sprint.start_date)}
                          {sh.sprint.end_date && ` - ${formatDate(sh.sprint.end_date)}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`
                    text-sm
                    ${sh.submitted ? 'text-brand-green' : 'text-text-muted'}
                  `}>
                    {sh.submitted && sh.submittedAt
                      ? formatDate(sh.submittedAt)
                      : index === 0
                        ? 'Not yet'
                        : 'Missed'
                    }
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">No submission history yet</p>
              <Link
                href="/internal/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-dark-pure font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Submit Your First Update
              </Link>
            </div>
          )}
        </div>

        {/* Recent High Fives Received */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-light-DEFAULT">High Fives Received</h2>
            <Link
              href="/internal/team"
              className="text-brand-green text-sm hover:underline"
            >
              View all →
            </Link>
          </div>

          {progress && progress.recentHighFives.length > 0 ? (
            <div className="space-y-3">
              {progress.recentHighFives.map((hf) => (
                <div key={hf.id} className="bg-dark-pure/50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🙌</span>
                      <span className="text-brand-yellow font-medium text-sm">
                        From {hf.from_intern_name.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-text-muted text-xs">
                      {formatTimeAgo(hf.created_at)}
                    </span>
                  </div>
                  <p className="text-text-light text-sm">{hf.message}</p>
                  {hf.category && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-brand-green/10 text-brand-green text-xs rounded">
                      {hf.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🙌</div>
              <p className="text-text-muted">No high fives received yet</p>
              <p className="text-text-muted text-sm mt-1">
                Keep up the great work!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      {progress && (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4">Tasks & Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-pure/50 rounded-lg">
              <p className="text-2xl font-bold text-brand-green">{progress.tasksCompleted}</p>
              <p className="text-text-muted text-sm">Tasks Completed</p>
            </div>
            <div className="text-center p-4 bg-dark-pure/50 rounded-lg">
              <p className="text-2xl font-bold text-brand-yellow">{progress.currentStreak}</p>
              <p className="text-text-muted text-sm">Week Streak</p>
            </div>
            <div className="text-center p-4 bg-dark-pure/50 rounded-lg">
              <p className="text-2xl font-bold text-accent-teal">{progress.highFivesReceived}</p>
              <p className="text-text-muted text-sm">Recognition</p>
            </div>
            <div className="text-center p-4 bg-dark-pure/50 rounded-lg">
              <p className="text-2xl font-bold text-accent-purple">{progress.totalSubmissions}</p>
              <p className="text-text-muted text-sm">Updates</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
