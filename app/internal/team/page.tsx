'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';

interface HighFive {
  id: number;
  from_intern_id: number;
  to_intern_id: number;
  from_intern_name: string;
  to_intern_name: string;
  message: string;
  category: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'teamwork', label: 'Teamwork', emoji: '🤝' },
  { value: 'creativity', label: 'Creativity', emoji: '💡' },
  { value: 'hustle', label: 'Hustle', emoji: '🚀' },
  { value: 'problem-solving', label: 'Problem-solving', emoji: '🧩' },
  { value: 'communication', label: 'Communication', emoji: '💬' },
];

export default function TeamPage() {
  const { currentUser, activeSprint, interns } = usePortal();
  const [highFives, setHighFives] = useState<HighFive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);

  // Form state
  const [toInternId, setToInternId] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchHighFives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHighFives = async () => {
    try {
      const response = await fetch('/api/internal/high-fives?limit=50');
      if (response.ok) {
        const data = await response.json();
        setHighFives(data);
      }
    } catch (error) {
      console.error('Failed to fetch high fives');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !toInternId || !message) return;

    setSending(true);
    try {
      const response = await fetch('/api/internal/high-fives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromInternId: currentUser.id,
          toInternId: parseInt(toInternId),
          message,
          category: category || undefined,
          sprintId: activeSprint?.id,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setToInternId('');
        setMessage('');
        setCategory('');
        fetchHighFives();
      }
    } catch (error) {
      console.error('Failed to send high five');
    } finally {
      setSending(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryEmoji = (cat: string | null) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found?.emoji || '🙌';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-dark-card/50 rounded-xl animate-pulse" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-24 bg-dark-card/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT flex items-center gap-2">
            <span>🙌</span> Team Recognition
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Celebrate your teammates&apos; wins
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!currentUser}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5
                   bg-brand-yellow hover:bg-secondary-dark text-dark-pure font-medium rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-glow-yellow hover:shadow-glow-lg"
        >
          <span className="text-lg">🙌</span>
          Give a High Five
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {CATEGORIES.map(cat => {
          const count = highFives.filter(hf => hf.category === cat.value).length;
          return (
            <div
              key={cat.value}
              className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <p className="text-xl font-bold text-light-DEFAULT mt-1">{count}</p>
              <p className="text-text-muted text-xs">{cat.label}</p>
            </div>
          );
        })}
      </div>

      {/* High Fives Feed */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-light-DEFAULT mb-4">Recognition Feed</h2>

        {highFives.length > 0 ? (
          <div className="space-y-4">
            {highFives.map((hf) => (
              <div
                key={hf.id}
                className="bg-dark-pure/50 rounded-xl p-4 border border-brand-green/10 hover:border-brand-green/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-brand-yellow/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {getCategoryEmoji(hf.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-light-DEFAULT text-sm">
                        <span className="text-brand-yellow font-semibold">
                          {hf.from_intern_name}
                        </span>
                        {' recognized '}
                        <span className="text-brand-green font-semibold">
                          {hf.to_intern_name}
                        </span>
                      </p>
                      <span className="text-text-muted text-xs whitespace-nowrap">
                        {formatTimeAgo(hf.created_at)}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-text-light text-sm leading-relaxed">
                      &quot;{hf.message}&quot;
                    </p>

                    {/* Category tag */}
                    {hf.category && (
                      <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-1 bg-brand-green/10 text-brand-green text-xs rounded-full">
                        {getCategoryEmoji(hf.category)}
                        {CATEGORIES.find(c => c.value === hf.category)?.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🙌</div>
            <h3 className="text-lg font-semibold text-light-DEFAULT mb-2">
              No high fives yet!
            </h3>
            <p className="text-text-muted mb-4">
              Be the first to recognize a teammate.
            </p>
            <button
              onClick={() => setShowModal(true)}
              disabled={!currentUser}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-dark-pure font-medium rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              Give the First High Five
            </button>
          </div>
        )}
      </div>

      {/* Give High Five Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-light-DEFAULT flex items-center gap-2">
                <span>🙌</span> Give a High Five
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text-light p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Who are you recognizing? <span className="text-accent-coral">*</span>
                </label>
                <select
                  value={toInternId}
                  onChange={(e) => setToInternId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT
                           focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
                >
                  <option value="">Select teammate...</option>
                  {interns
                    .filter(i => i.id !== currentUser?.id)
                    .map(intern => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  What did they do? <span className="text-accent-coral">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Helped me debug the API, crushed that presentation..."
                  rows={3}
                  required
                  minLength={10}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT placeholder-text-muted resize-none
                           focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Category <span className="text-text-muted">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
                        ${category === cat.value
                          ? 'bg-brand-green text-dark-pure'
                          : 'bg-dark-pure/50 border border-brand-green/30 text-text-light hover:border-brand-green/50'
                        }
                      `}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending || !toInternId || !message}
                className="w-full py-3 px-4 bg-brand-yellow hover:bg-secondary-dark
                         text-dark-pure font-semibold rounded-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🎉</span>
                    Send High Five
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
