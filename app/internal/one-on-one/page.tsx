'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';

interface OneOnOne {
  id: number;
  intern_id: number;
  sprint_id: number | null;
  proud_of: string | null;
  need_help: string | null;
  questions: string | null;
  prep_submitted_at: string | null;
  sprint_name: string | null;
  created_at: string;
}

export default function OneOnOnePage() {
  const { profile, activeSprint } = usePortal();
  const [oneOnOne, setOneOnOne] = useState<OneOnOne | null>(null);
  const [history, setHistory] = useState<OneOnOne[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    proudOf: '',
    needHelp: '',
    questions: '',
  });

  useEffect(() => {
    if (profile && activeSprint) {
      fetchOneOnOne();
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [profile, activeSprint]);

  const fetchOneOnOne = async () => {
    try {
      const response = await fetch(
        `/api/internal/one-on-ones?profileId=${profile?.id}&sprintId=${activeSprint?.id}`
      );
      if (response.ok) {
        const data = await response.json();
        const current = data[0];
        if (current) {
          setOneOnOne(current);
          setFormData({
            proudOf: current.proud_of || '',
            needHelp: current.need_help || '',
            questions: current.questions || '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch 1:1');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/internal/one-on-ones?profileId=${profile?.id}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.filter((o: OneOnOne) => String(o.sprint_id) !== activeSprint?.id));
      }
    } catch (error) {
      console.error('Failed to fetch history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !activeSprint) return;

    setSaving(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/internal/one-on-ones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          sprintId: activeSprint.id,
          proudOf: formData.proudOf || undefined,
          needHelp: formData.needHelp || undefined,
          questions: formData.questions || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOneOnOne(data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save 1:1 prep');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-accent-teal/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-light-DEFAULT mb-2">Select Your Profile</h2>
        <p className="text-text-muted text-center max-w-md">
          Please select yourself from the dropdown in the sidebar to prepare for your 1:1.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-dark-card/50 rounded-xl animate-pulse" />
        <div className="h-96 bg-dark-card/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-light-DEFAULT flex items-center gap-2">
          <span>📋</span> 1:1 Prep
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {activeSprint?.name || 'No active sprint'}
        </p>
      </div>

      {/* Info box */}
      <div className="bg-accent-teal/10 border border-accent-teal/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-accent-teal font-medium">Prepare for your call with Tim</p>
            <p className="text-text-muted text-sm mt-1">
              Fill this out before your 1:1 so you can have a more productive conversation.
              Your answers help Tim understand how to best support you.
            </p>
          </div>
        </div>
      </div>

      {/* Prep Form */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
        {oneOnOne?.prep_submitted_at && (
          <div className="mb-6 flex items-center gap-2 text-brand-green text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Last saved: {formatDate(oneOnOne.prep_submitted_at)}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 rounded-xl">
            <div className="flex items-center gap-2 text-brand-green">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Prep saved successfully!</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proud of */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              What are you proud of this week?
            </label>
            <textarea
              value={formData.proudOf}
              onChange={(e) => setFormData({ ...formData, proudOf: e.target.value })}
              placeholder="Shipped the new feature, got great feedback on my presentation..."
              rows={4}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
            />
          </div>

          {/* Need help */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              What do you need help with?
            </label>
            <textarea
              value={formData.needHelp}
              onChange={(e) => setFormData({ ...formData, needHelp: e.target.value })}
              placeholder="Stuck on this technical issue, need advice on prioritization..."
              rows={4}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
            />
          </div>

          {/* Questions */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Questions for Tim/Dylan
            </label>
            <textarea
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
              placeholder="How should I approach this stakeholder? What's the vision for Q2?"
              rows={4}
              className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                       text-light-DEFAULT placeholder-text-muted resize-none
                       focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 px-6 bg-brand-green hover:bg-primary-dark
                     text-dark-pure font-semibold rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Prep
              </>
            )}
          </button>
        </form>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4">Previous 1:1 Preps</h2>

          <div className="space-y-4">
            {history.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="bg-dark-pure/50 rounded-lg p-4 border border-brand-green/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-brand-green text-sm font-medium">
                    {o.sprint_name || 'Unknown Sprint'}
                  </span>
                  {o.prep_submitted_at && (
                    <span className="text-text-muted text-xs">
                      {formatDate(o.prep_submitted_at)}
                    </span>
                  )}
                </div>

                {o.proud_of && (
                  <div className="mb-2">
                    <p className="text-text-muted text-xs uppercase mb-1">Proud of</p>
                    <p className="text-text-light text-sm line-clamp-2">{o.proud_of}</p>
                  </div>
                )}

                {o.need_help && (
                  <div className="mb-2">
                    <p className="text-text-muted text-xs uppercase mb-1">Needed help</p>
                    <p className="text-text-light text-sm line-clamp-2">{o.need_help}</p>
                  </div>
                )}

                {o.questions && (
                  <div>
                    <p className="text-text-muted text-xs uppercase mb-1">Questions</p>
                    <p className="text-text-light text-sm line-clamp-2">{o.questions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
