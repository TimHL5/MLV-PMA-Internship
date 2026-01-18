'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { Submission, HighFive, Profile } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import {
  User,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Flame,
  CheckCircle,
} from 'lucide-react';

interface SubmissionWithSprint extends Omit<Submission, 'sprint'> {
  sprint?: { name: string; id: string };
}

interface HighFiveWithProfile extends HighFive {
  from_profile: Profile;
}

export default function MyProgressPage() {
  const { user } = useAuth();
  const { team, sprints, currentSprint } = useTeam();
  const [submissions, setSubmissions] = useState<SubmissionWithSprint[]>([]);
  const [highFives, setHighFives] = useState<HighFiveWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!team || !user) return;

    try {
      // Fetch user&apos;s submissions
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select(`
          *,
          sprint:sprints(name, id)
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      setSubmissions(submissionsData || []);

      // Fetch high fives received
      const { data: highFivesData } = await supabase
        .from('high_fives')
        .select(`
          *,
          from_profile:profiles!high_fives_from_profile_id_fkey(*)
        `)
        .eq('to_profile_id', user.id)
        .eq('team_id', team.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setHighFives(highFivesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [team, user, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const totalSubmissions = submissions.length;
  const currentSprintSubmission = submissions.find(
    (s) => s.sprint_id === currentSprint?.id
  );

  // Calculate streak
  const calculateStreak = () => {
    if (sprints.length === 0) return 0;

    let streak = 0;
    const sortedSprints = [...sprints].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
    const submittedSprintIds = new Set(submissions.map((s) => s.sprint_id));

    for (const sprint of sortedSprints) {
      if (submittedSprintIds.has(sprint.id)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Calculate average mood
  const moodValues: Record<string, number> = {
    great: 4,
    good: 3,
    okay: 2,
    struggling: 1,
  };

  const submissionsWithMood = submissions.filter((s) => s.mood);
  const averageMood =
    submissionsWithMood.length > 0
      ? submissionsWithMood.reduce(
          (sum, s) => sum + (moodValues[s.mood!] || 0),
          0
        ) / submissionsWithMood.length
      : null;

  const getMoodLabel = (avg: number) => {
    if (avg >= 3.5) return { label: 'Great', emoji: '😄' };
    if (avg >= 2.5) return { label: 'Good', emoji: '🙂' };
    if (avg >= 1.5) return { label: 'Okay', emoji: '😐' };
    return { label: 'Needs Support', emoji: '😓' };
  };

  const CATEGORY_EMOJIS: Record<string, string> = {
    teamwork: '🤝',
    creativity: '💡',
    hustle: '🚀',
    'problem-solving': '🧩',
    communication: '💬',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-dark-card/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-dark-card/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-brand-green/20 via-dark-card to-dark-card border border-brand-green/30 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name}
              width={72}
              height={72}
              className="rounded-full ring-2 ring-brand-green/30"
            />
          ) : (
            <div className="w-18 h-18 rounded-full bg-brand-green/20 flex items-center justify-center">
              <User className="w-8 h-8 text-brand-green" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-light-DEFAULT">
              {user?.full_name}
            </h1>
            <p className="text-text-muted">{user?.email}</p>
            {user?.location && (
              <p className="text-text-muted text-sm mt-1">📍 {user.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-green/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">
                {totalSubmissions}
              </p>
              <p className="text-xs text-text-muted">Submissions</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-yellow/10 rounded-lg">
              <Flame className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">{streak}</p>
              <p className="text-xs text-text-muted">Sprint Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Award className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">
                {highFives.length}
              </p>
              <p className="text-xs text-text-muted">High Fives</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {averageMood ? (
                <>
                  <p className="text-2xl font-bold text-light-DEFAULT">
                    {getMoodLabel(averageMood).emoji}
                  </p>
                  <p className="text-xs text-text-muted">Avg Mood</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-text-muted">N/A</p>
                  <p className="text-xs text-text-muted">Avg Mood</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-green" />
            Recent Submissions
          </h2>

          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-dark-pure/50 rounded-xl border border-brand-green/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-brand-green">
                      {sub.sprint?.name || 'Unknown Sprint'}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatDistanceToNow(new Date(sub.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-text-light line-clamp-2">{sub.goals}</p>
                  {sub.mood && (
                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-xs rounded-full ${
                        sub.mood === 'great'
                          ? 'bg-brand-green/10 text-brand-green'
                          : sub.mood === 'good'
                          ? 'bg-blue-500/10 text-blue-400'
                          : sub.mood === 'okay'
                          ? 'bg-brand-yellow/10 text-brand-yellow'
                          : 'bg-accent-coral/10 text-accent-coral'
                      }`}
                    >
                      {sub.mood === 'great'
                        ? '😄'
                        : sub.mood === 'good'
                        ? '🙂'
                        : sub.mood === 'okay'
                        ? '😐'
                        : '😓'}{' '}
                      {sub.mood}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-text-muted">No submissions yet</p>
            </div>
          )}
        </div>

        {/* High Fives Received */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4 flex items-center gap-2">
            <span>🙌</span>
            High Fives Received
          </h2>

          {highFives.length > 0 ? (
            <div className="space-y-4">
              {highFives.map((hf) => (
                <div
                  key={hf.id}
                  className="flex items-start gap-3 p-3 bg-dark-pure/50 rounded-xl border border-brand-green/10"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-xl flex-shrink-0">
                    {hf.category ? CATEGORY_EMOJIS[hf.category] : '🙌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-light-DEFAULT">
                      From{' '}
                      <span className="text-brand-yellow font-medium">
                        {hf.from_profile?.full_name}
                      </span>
                    </p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">
                      &quot;{hf.message}&quot;
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDistanceToNow(new Date(hf.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🌟</div>
              <p className="text-text-muted">No high fives received yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission History Calendar */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-light-DEFAULT mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-green" />
          Sprint History
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sprints.slice(0, 12).map((sprint) => {
            const submission = submissions.find((s) => s.sprint_id === sprint.id);
            const isCurrentSprint = sprint.id === currentSprint?.id;

            return (
              <div
                key={sprint.id}
                className={`
                  p-3 rounded-xl border text-center
                  ${
                    submission
                      ? 'bg-brand-green/10 border-brand-green/30'
                      : isCurrentSprint
                      ? 'bg-brand-yellow/10 border-brand-yellow/30'
                      : 'bg-dark-pure/30 border-brand-green/10'
                  }
                `}
              >
                <p className="text-xs font-medium text-light-DEFAULT truncate">
                  {sprint.name}
                </p>
                <div className="mt-2">
                  {submission ? (
                    <CheckCircle className="w-5 h-5 text-brand-green mx-auto" />
                  ) : isCurrentSprint ? (
                    <span className="text-xs text-brand-yellow">Active</span>
                  ) : (
                    <span className="text-xs text-text-muted">Missed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
