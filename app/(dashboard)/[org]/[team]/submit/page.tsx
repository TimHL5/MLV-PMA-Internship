'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { Submission } from '@/lib/types';
import { toast } from 'sonner';
import {
  Target,
  Package,
  AlertTriangle,
  Lightbulb,
  Heart,
  Clock,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const MOODS = [
  { value: 'great', label: 'Great', emoji: '😄', color: 'brand-green' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'blue-400' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'brand-yellow' },
  { value: 'struggling', label: 'Struggling', emoji: '😓', color: 'accent-coral' },
];

export default function SubmitPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { currentSprint, team } = useTeam();
  const [loading, setLoading] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const supabase = createClient();

  const baseUrl = `/${params.org}/${params.team}`;

  // Form state
  const [goals, setGoals] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [blockers, setBlockers] = useState('');
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    if (user && currentSprint) {
      checkExistingSubmission();
    }
  }, [user, currentSprint]);

  const checkExistingSubmission = async () => {
    if (!user || !currentSprint) return;

    try {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('profile_id', user.id)
        .eq('sprint_id', currentSprint.id)
        .single();

      if (data) {
        setExistingSubmission(data);
        setGoals(data.goals);
        setDeliverables(data.deliverables);
        setBlockers(data.blockers || '');
        setReflection(data.reflection || '');
        setMood(data.mood || '');
        setHoursWorked(data.hours_worked?.toString() || '');
      }
    } catch (error) {
      // No existing submission, that&apos;s fine
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !currentSprint || !team) {
      toast.error('Missing required data');
      return;
    }

    if (goals.trim().length < 10) {
      toast.error('Goals must be at least 10 characters');
      return;
    }

    if (deliverables.trim().length < 10) {
      toast.error('Deliverables must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        profile_id: user.id,
        sprint_id: currentSprint.id,
        team_id: team.id,
        goals: goals.trim(),
        deliverables: deliverables.trim(),
        blockers: blockers.trim() || null,
        reflection: reflection.trim() || null,
        mood: mood || null,
        hours_worked: hoursWorked ? parseInt(hoursWorked) : null,
      };

      if (existingSubmission) {
        // Update existing
        const { error } = await supabase
          .from('submissions')
          .update({ ...submissionData, updated_at: new Date().toISOString() })
          .eq('id', existingSubmission.id);

        if (error) throw error;
        toast.success('Submission updated successfully!');
      } else {
        // Create new
        const { error } = await supabase.from('submissions').insert(submissionData);

        if (error) throw error;
        toast.success('Submission created successfully!');
      }

      router.push(baseUrl);
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-card/50 rounded w-1/3" />
          <div className="h-64 bg-dark-card/50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!currentSprint) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-xl font-semibold text-light-DEFAULT mb-2">
          No Active Sprint
        </h2>
        <p className="text-text-muted mb-6">
          There&apos;s no active sprint to submit to right now.
        </p>
        <Link
          href={baseUrl}
          className="inline-flex items-center gap-2 text-brand-green hover:text-primary-light"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <Link
          href={baseUrl}
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-light mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-light-DEFAULT">
          {existingSubmission ? 'Update Your Submission' : 'Weekly Submission'}
        </h1>
        <p className="text-text-muted mt-1">
          {currentSprint.name} &bull; Share your progress with the team
        </p>
      </div>

      {existingSubmission && (
        <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-light-DEFAULT">
              You&apos;ve already submitted!
            </p>
            <p className="text-xs text-text-muted">
              You can update your submission below.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goals */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
            <Target className="w-4 h-4 text-brand-green" />
            What were your goals this week? <span className="text-accent-coral">*</span>
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Describe the objectives you set out to achieve..."
            rows={4}
            required
            minLength={10}
            className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                     text-light-DEFAULT placeholder-text-muted resize-none
                     focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
          />
        </div>

        {/* Deliverables */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
            <Package className="w-4 h-4 text-brand-yellow" />
            What did you deliver/accomplish? <span className="text-accent-coral">*</span>
          </label>
          <textarea
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="List what you completed, shipped, or made progress on..."
            rows={4}
            required
            minLength={10}
            className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                     text-light-DEFAULT placeholder-text-muted resize-none
                     focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
          />
        </div>

        {/* Blockers */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
            <AlertTriangle className="w-4 h-4 text-accent-coral" />
            Any blockers or challenges?
          </label>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Share anything that slowed you down or needs attention..."
            rows={3}
            className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                     text-light-DEFAULT placeholder-text-muted resize-none
                     focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
          />
        </div>

        {/* Reflection */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Reflections or learnings
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What did you learn? Any insights or ideas?"
            rows={3}
            className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                     text-light-DEFAULT placeholder-text-muted resize-none
                     focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
          />
        </div>

        {/* Mood & Hours */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Mood */}
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
            <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
              <Heart className="w-4 h-4 text-pink-400" />
              How are you feeling?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(mood === m.value ? '' : m.value)}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm
                    transition-all duration-200
                    ${
                      mood === m.value
                        ? `bg-${m.color}/20 border-${m.color}/50 text-${m.color} border`
                        : 'bg-dark-pure/50 border border-brand-green/20 text-text-light hover:border-brand-green/40'
                    }
                  `}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
            <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-3">
              <Clock className="w-4 h-4 text-purple-400" />
              Hours worked this week
            </label>
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              placeholder="e.g., 40"
              min="0"
              max="168"
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !goals || !deliverables}
          className="w-full py-4 px-6 bg-brand-green hover:bg-primary-dark
                   text-dark-pure font-semibold rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 transform hover:scale-[1.02]
                   shadow-glow-green hover:shadow-glow-lg
                   flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {existingSubmission ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {existingSubmission ? 'Update Submission' : 'Submit Update'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
