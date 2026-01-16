'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import Link from 'next/link';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😫', label: 'Struggling' },
  { value: 2, emoji: '😕', label: 'Challenging' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

export default function SubmitPage() {
  const { currentUser, activeSprint, interns, sprints } = usePortal();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    internId: '',
    sprintId: '',
    goals: '',
    deliverables: '',
    blockers: '',
    reflection: '',
    mood: 0,
    hoursWorked: '',
  });

  // Pre-fill intern and sprint if available
  useEffect(() => {
    if (currentUser && !formData.internId) {
      setFormData(prev => ({ ...prev, internId: currentUser.id.toString() }));
    }
    if (activeSprint && !formData.sprintId) {
      setFormData(prev => ({ ...prev, sprintId: activeSprint.id.toString() }));
    }
  }, [currentUser, activeSprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/internal/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internId: parseInt(formData.internId),
          sprintId: parseInt(formData.sprintId),
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
        // Reset form but keep intern/sprint selected
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
    } catch (err) {
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

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-light-DEFAULT">Weekly Progress Update</h1>
        <p className="text-text-muted text-sm mt-1">
          Submit your goals and deliverables for this sprint
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-brand-green font-medium">Submission successful!</p>
              <p className="text-text-muted text-sm">Your progress update has been recorded.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/internal/home"
              className="px-4 py-2 bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm rounded-lg hover:bg-brand-green/20 transition-colors"
            >
              View Dashboard
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="px-4 py-2 text-text-muted text-sm hover:text-text-light transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-accent-coral/10 border border-accent-coral/30 rounded-xl">
          <p className="text-accent-coral text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Intern & Sprint Selection */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Your Name <span className="text-accent-coral">*</span>
              </label>
              <select
                name="internId"
                value={formData.internId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                         transition-all duration-200"
              >
                <option value="">Select your name</option>
                {interns.map(intern => (
                  <option key={intern.id} value={intern.id}>
                    {intern.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Sprint <span className="text-accent-coral">*</span>
              </label>
              <select
                name="sprintId"
                value={formData.sprintId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                         transition-all duration-200"
              >
                <option value="">Select sprint</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} {sprint.is_active ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Goals for This Week <span className="text-accent-coral">*</span>
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="What do you plan to accomplish this week?"
              rows={3}
              required
              minLength={10}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                       transition-all duration-200"
            />
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Deliverables Completed <span className="text-accent-coral">*</span>
            </label>
            <textarea
              name="deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              placeholder="What did you actually complete or accomplish?"
              rows={3}
              required
              minLength={10}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                       transition-all duration-200"
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Blockers <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              name="blockers"
              value={formData.blockers}
              onChange={handleChange}
              placeholder="Any obstacles or challenges preventing progress?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                       transition-all duration-200"
            />
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Reflection <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              name="reflection"
              value={formData.reflection}
              onChange={handleChange}
              placeholder="What did you learn this week? Any insights?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                       transition-all duration-200"
            />
          </div>

          {/* Mood & Hours */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-3">
                How are you feeling? <span className="text-text-muted">(optional)</span>
              </label>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
                    className={`
                      flex-1 py-2 rounded-lg text-2xl transition-all
                      ${formData.mood === option.value
                        ? 'bg-brand-green/20 border-2 border-brand-green scale-110'
                        : 'bg-dark-pure/50 border border-brand-green/20 hover:border-brand-green/40'
                      }
                    `}
                    title={option.label}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
              {formData.mood > 0 && (
                <p className="text-center text-text-muted text-sm mt-2">
                  {MOOD_OPTIONS.find(o => o.value === formData.mood)?.label}
                </p>
              )}
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-3">
                Hours worked <span className="text-text-muted">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                  className="w-24 px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT text-center
                           focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
                />
                <span className="text-text-muted">hours this week</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !formData.internId || !formData.sprintId || !formData.goals || !formData.deliverables}
            className="w-full py-4 px-6 bg-brand-green hover:bg-primary-dark
                     text-dark-pure font-semibold rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:scale-[1.02]
                     shadow-glow-green hover:shadow-glow-lg
                     flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
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
          </button>
        </form>
      </div>
    </div>
  );
}
