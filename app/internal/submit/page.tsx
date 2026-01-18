'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😫', label: 'Struggling', color: 'from-accent-coral/20 to-accent-coral/5' },
  { value: 2, emoji: '😕', label: 'Challenging', color: 'from-brand-yellow/20 to-brand-yellow/5' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'from-text-muted/20 to-text-muted/5' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'from-accent-teal/20 to-accent-teal/5' },
  { value: 5, emoji: '😊', label: 'Great', color: 'from-brand-green/20 to-brand-green/5' },
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

// Form field component
function FormField({
  label,
  required,
  optional,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <label className="block text-sm font-medium text-text-light/80 mb-2">
        {label}
        {required && <span className="text-accent-coral ml-1">*</span>}
        {optional && <span className="text-text-muted/50 ml-1">(optional)</span>}
      </label>
      {children}
      {hint && <p className="text-text-muted/50 text-xs mt-2">{hint}</p>}
    </motion.div>
  );
}

export default function SubmitPage() {
  const { profile, activeSprint, selectedTeam } = usePortal();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    profileId: '',
    sprintId: '',
    goals: '',
    deliverables: '',
    blockers: '',
    reflection: '',
    mood: 0,
    hoursWorked: '',
  });

  // Form progress
  const getProgress = () => {
    let filled = 0;
    if (formData.profileId) filled++;
    if (formData.sprintId) filled++;
    if (formData.goals.length >= 10) filled++;
    if (formData.deliverables.length >= 10) filled++;
    return (filled / 4) * 100;
  };

  // Pre-fill profile and sprint if available
  useEffect(() => {
    if (profile && !formData.profileId) {
      setFormData(prev => ({ ...prev, profileId: profile.id }));
    }
    if (activeSprint && !formData.sprintId) {
      setFormData(prev => ({ ...prev, sprintId: activeSprint.id }));
    }
  }, [profile, activeSprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/internal/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: formData.profileId,
          sprintId: formData.sprintId,
          teamId: selectedTeam?.id,
          goals: formData.goals,
          deliverables: formData.deliverables,
          blockers: formData.blockers || undefined,
          reflection: formData.reflection || undefined,
          mood: formData.mood || undefined,
          hoursWorked: formData.hoursWorked ? parseInt(formData.hoursWorked) : undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData(prev => ({
          ...prev,
          goals: '',
          deliverables: '',
          blockers: '',
          reflection: '',
          mood: 0,
          hoursWorked: '',
        }));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const progress = getProgress();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto pb-20 lg:pb-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white tracking-tight"
        >
          Weekly Progress Update
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted/70 mt-2"
        >
          Share your goals and accomplishments for this sprint
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between text-sm text-text-muted/60 mb-2">
          <span>Form Progress</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-green via-brand-green to-brand-yellow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Success message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-5 bg-gradient-to-br from-brand-green/15 to-brand-green/5 border border-brand-green/20 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div className="flex-1">
                <p className="text-brand-green font-semibold text-lg">Submission successful!</p>
                <p className="text-text-muted/70 text-sm mt-1">Your progress update has been recorded.</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Link
                href="/internal/home"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 text-brand-green text-sm font-medium rounded-xl hover:bg-brand-green/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                View Dashboard
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2.5 text-text-muted/70 text-sm hover:text-text-light transition-colors"
              >
                Submit Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-accent-coral/10 border border-accent-coral/20 rounded-xl"
          >
            <p className="text-accent-coral text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {/* User & Sprint Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Submitting as">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center text-brand-green font-medium">
                  {profile?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="text-white font-medium">{profile?.full_name || 'Loading...'}</span>
              </div>
            </FormField>

            <FormField label="Sprint">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-white">{activeSprint?.name || 'No active sprint'}</span>
              </div>
            </FormField>
          </div>

          {/* Team Selection - if team not selected */}
          {!selectedTeam && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl"
            >
              <p className="text-brand-yellow text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Please select your team in the sidebar before submitting.
              </p>
            </motion.div>
          )}

          {/* Goals */}
          <FormField label="Goals for This Week" required hint="What do you plan to accomplish? Be specific.">
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="e.g., Complete user authentication flow, write unit tests..."
              rows={3}
              required
              minLength={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 resize-none focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
            />
          </FormField>

          {/* Deliverables */}
          <FormField label="Deliverables Completed" required hint="What did you actually complete or accomplish?">
            <textarea
              name="deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              placeholder="e.g., Shipped login page, fixed 3 bugs, reviewed 5 PRs..."
              rows={3}
              required
              minLength={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 resize-none focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
            />
          </FormField>

          {/* Blockers */}
          <FormField label="Blockers" optional>
            <textarea
              name="blockers"
              value={formData.blockers}
              onChange={handleChange}
              placeholder="Any obstacles or challenges preventing progress?"
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 resize-none focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
            />
          </FormField>

          {/* Reflection */}
          <FormField label="Reflection" optional hint="What did you learn? Any insights to share?">
            <textarea
              name="reflection"
              value={formData.reflection}
              onChange={handleChange}
              placeholder="Share any learnings, a-ha moments, or observations..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/40 resize-none focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
            />
          </FormField>

          {/* Mood & Hours */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Mood */}
            <FormField label="How are you feeling?" optional>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-3 rounded-xl text-2xl transition-all duration-200 ${
                      formData.mood === option.value
                        ? `bg-gradient-to-br ${option.color} border-2 border-white/20 shadow-lg`
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                    title={option.label}
                  >
                    <motion.span
                      animate={formData.mood === option.value ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {option.emoji}
                    </motion.span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {formData.mood > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-center text-text-muted/60 text-sm mt-3"
                  >
                    {MOOD_OPTIONS.find(o => o.value === formData.mood)?.label}
                  </motion.p>
                )}
              </AnimatePresence>
            </FormField>

            {/* Hours */}
            <FormField label="Hours worked" optional>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                  className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
                />
                <span className="text-text-muted/60">hours this week</span>
              </div>
            </FormField>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting || !formData.profileId || !formData.sprintId || formData.goals.length < 10 || formData.deliverables.length < 10}
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.99 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-green to-brand-green/80 hover:from-brand-green hover:to-brand-green text-dark-pure font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 hover:shadow-xl flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-dark-pure/30 border-t-dark-pure rounded-full"
                />
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Progress Update
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
