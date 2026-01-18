'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { Submission, HighFive, Profile } from '@/lib/types';
import {
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SubmissionWithProfile extends Submission {
  profile: Profile;
}

interface HighFiveWithProfiles extends HighFive {
  from_profile: Profile;
  to_profile: Profile;
}

export default function DashboardPage() {
  const params = useParams();
  const { user } = useAuth();
  const { team, members, currentSprint } = useTeam();
  const [submissions, setSubmissions] = useState<SubmissionWithProfile[]>([]);
  const [highFives, setHighFives] = useState<HighFiveWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const baseUrl = `/${params.org}/${params.team}`;

  useEffect(() => {
    if (team && currentSprint) {
      fetchDashboardData();
    }
  }, [team, currentSprint]);

  const fetchDashboardData = async () => {
    if (!team || !currentSprint) return;

    try {
      setLoading(true);

      // Fetch submissions for current sprint
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('sprint_id', currentSprint.id)
        .order('created_at', { ascending: false });

      setSubmissions(submissionsData || []);

      // Fetch recent high fives
      const { data: highFivesData } = await supabase
        .from('high_fives')
        .select(`
          *,
          from_profile:profiles!high_fives_from_profile_id_fkey(*),
          to_profile:profiles!high_fives_to_profile_id_fkey(*)
        `)
        .eq('team_id', team.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setHighFives(highFivesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const submittedProfileIds = new Set(submissions.map((s) => s.profile_id));
  const totalMembers = members.length;
  const submittedCount = submittedProfileIds.size;
  const missingCount = totalMembers - submittedCount;
  const hasUserSubmitted = user ? submittedProfileIds.has(user.id) : false;

  // Get members who haven't submitted
  const missingMembers = members.filter(
    (m) => !submittedProfileIds.has(m.profile_id)
  );

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
        <div className="h-64 bg-dark-card/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-green/20 via-dark-card to-dark-card border border-brand-green/30 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-light-DEFAULT">
              Welcome back, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-text-muted mt-1">
              {currentSprint
                ? `${currentSprint.name} is active`
                : 'No active sprint'}
            </p>
          </div>
          {!hasUserSubmitted && currentSprint && (
            <Link
              href={`${baseUrl}/submit`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5
                       bg-brand-yellow hover:bg-secondary-dark text-dark-pure font-medium rounded-xl
                       transition-all duration-200 shadow-glow-yellow hover:shadow-glow-lg"
            >
              <FileText className="w-4 h-4" />
              Submit Update
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-green/10 rounded-lg">
              <Users className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">{totalMembers}</p>
              <p className="text-xs text-text-muted">Team Members</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-green/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">{submittedCount}</p>
              <p className="text-xs text-text-muted">Submitted</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-coral/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-accent-coral" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">{missingCount}</p>
              <p className="text-xs text-text-muted">Missing</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-yellow/10 rounded-lg">
              <Award className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-DEFAULT">{highFives.length}</p>
              <p className="text-xs text-text-muted">High Fives</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Who&apos;s Missing */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-light-DEFAULT flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-coral" />
              Who&apos;s Missing?
            </h2>
            <span className="text-sm text-text-muted">
              {missingCount} / {totalMembers}
            </span>
          </div>

          {missingMembers.length > 0 ? (
            <div className="space-y-3">
              {missingMembers.slice(0, 6).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 bg-dark-pure/50 rounded-lg"
                >
                  {member.profile?.avatar_url ? (
                    <Image
                      src={member.profile.avatar_url}
                      alt={member.profile.full_name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-accent-coral/20 flex items-center justify-center">
                      <span className="text-accent-coral text-sm font-medium">
                        {member.profile?.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-light-DEFAULT truncate">
                      {member.profile?.full_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {member.profile?.location || 'No location'}
                    </p>
                  </div>
                </div>
              ))}
              {missingMembers.length > 6 && (
                <p className="text-sm text-text-muted text-center pt-2">
                  +{missingMembers.length - 6} more
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-text-light">Everyone has submitted!</p>
            </div>
          )}
        </div>

        {/* Recent High Fives */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-light-DEFAULT flex items-center gap-2">
              <span>🙌</span> Recent High Fives
            </h2>
            <Link
              href={`${baseUrl}/team`}
              className="text-sm text-brand-green hover:text-primary-light transition-colors"
            >
              View all
            </Link>
          </div>

          {highFives.length > 0 ? (
            <div className="space-y-4">
              {highFives.map((hf) => (
                <div key={hf.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-xl flex-shrink-0">
                    {hf.category ? CATEGORY_EMOJIS[hf.category] : '🙌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-light-DEFAULT">
                      <span className="text-brand-yellow font-medium">
                        {hf.from_profile?.full_name}
                      </span>
                      {' → '}
                      <span className="text-brand-green font-medium">
                        {hf.to_profile?.full_name}
                      </span>
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                      &quot;{hf.message}&quot;
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDistanceToNow(new Date(hf.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🤝</div>
              <p className="text-text-light">No high fives yet this sprint</p>
              <Link
                href={`${baseUrl}/team`}
                className="inline-block mt-3 text-sm text-brand-green hover:text-primary-light"
              >
                Give the first one!
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-light-DEFAULT flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-green" />
            Recent Submissions
          </h2>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="flex items-start gap-4 p-4 bg-dark-pure/50 rounded-xl border border-brand-green/10"
              >
                {sub.profile?.avatar_url ? (
                  <Image
                    src={sub.profile.avatar_url}
                    alt={sub.profile.full_name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center">
                    <span className="text-brand-green font-medium">
                      {sub.profile?.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-light-DEFAULT">
                      {sub.profile?.full_name}
                    </p>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-text-light">No submissions yet this sprint</p>
          </div>
        )}
      </div>
    </div>
  );
}
