'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import { motion, AnimatePresence } from 'framer-motion';

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
  { value: 'teamwork', label: 'Teamwork', emoji: '🤝', color: 'text-accent-teal' },
  { value: 'creativity', label: 'Creativity', emoji: '💡', color: 'text-brand-yellow' },
  { value: 'hustle', label: 'Hustle', emoji: '🚀', color: 'text-accent-coral' },
  { value: 'problem-solving', label: 'Problem Solving', emoji: '🧩', color: 'text-accent-purple' },
  { value: 'communication', label: 'Communication', emoji: '💬', color: 'text-brand-green' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export default function TeamPage() {
  const { currentUser, activeSprint, interns } = usePortal();
  const [highFives, setHighFives] = useState<HighFive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  // Form state
  const [toInternId, setToInternId] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchHighFives();
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
        setJustSent(true);
        setTimeout(() => {
          setShowModal(false);
          setToInternId('');
          setMessage('');
          setCategory('');
          setJustSent(false);
          fetchHighFives();
        }, 1500);
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

  const getCategoryInfo = (cat: string | null) => {
    return CATEGORIES.find(c => c.value === cat) || { emoji: '🙌', color: 'text-brand-yellow' };
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight flex items-center gap-3"
          >
            <span className="text-3xl">🙌</span>
            Team Recognition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted/70 mt-2"
          >
            Celebrate your teammates&apos; wins
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowModal(true)}
          disabled={!currentUser}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-yellow to-brand-yellow/80 hover:from-brand-yellow hover:to-brand-yellow text-dark-pure font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-yellow/20 hover:shadow-brand-yellow/40 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            🙌
          </motion.span>
          Give a High Five
        </motion.button>
      </motion.div>

      {/* Category Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat, index) => {
          const count = highFives.filter(hf => hf.category === cat.value).length;
          return (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 text-center group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />
              <motion.span
                className="text-3xl block"
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {cat.emoji}
              </motion.span>
              <p className={`text-2xl font-bold ${cat.color} mt-2`}>{count}</p>
              <p className="text-text-muted/60 text-xs mt-1">{cat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* High Fives Feed */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-dark-card/80 to-dark-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recognition Feed</h2>
            <span className="text-text-muted/50 text-sm">{highFives.length} high fives</span>
          </div>

          {highFives.length > 0 ? (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {highFives.map((hf, index) => {
                  const catInfo = getCategoryInfo(hf.category);
                  return (
                    <motion.div
                      key={hf.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      className="group bg-white/5 hover:bg-white/[0.07] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Category icon */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 flex items-center justify-center text-3xl flex-shrink-0 border border-brand-yellow/10"
                        >
                          {catInfo.emoji}
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm">
                              <span className="text-brand-yellow font-semibold">{hf.from_intern_name}</span>
                              <span className="text-text-muted/40 mx-2">→</span>
                              <span className="text-brand-green font-semibold">{hf.to_intern_name}</span>
                            </p>
                            <span className="text-text-muted/40 text-xs whitespace-nowrap">{formatTimeAgo(hf.created_at)}</span>
                          </div>

                          {/* Message */}
                          <p className="text-text-light/90 text-sm leading-relaxed">
                            &quot;{hf.message}&quot;
                          </p>

                          {/* Category tag */}
                          {hf.category && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-white/5 ${catInfo.color} text-xs rounded-full font-medium`}
                            >
                              {catInfo.emoji}
                              {CATEGORIES.find(c => c.value === hf.category)?.label}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🙌
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">No high fives yet!</h3>
              <p className="text-text-muted/60 mb-6 max-w-sm mx-auto">
                Be the first to recognize a teammate&apos;s great work.
              </p>
              <motion.button
                onClick={() => setShowModal(true)}
                disabled={!currentUser}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-dark-pure font-semibold rounded-xl hover:bg-brand-yellow/90 transition-colors disabled:opacity-50"
              >
                🎉 Give the First High Five
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Give High Five Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !sending && setShowModal(false)}
              className="absolute inset-0 bg-dark-pure/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-gradient-to-b from-dark-card to-dark-pure border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Success state */}
              <AnimatePresence>
                {justSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-dark-card rounded-2xl flex flex-col items-center justify-center z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-7xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-semibold text-white"
                    >
                      High Five Sent!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🙌</span> Give a High Five
                </h2>
                <motion.button
                  onClick={() => setShowModal(false)}
                  disabled={sending}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-text-muted/60 hover:text-text-light p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-2">
                    Who are you recognizing? <span className="text-accent-coral">*</span>
                  </label>
                  <select
                    value={toInternId}
                    onChange={(e) => setToInternId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
                  >
                    <option value="" className="bg-dark-card">Select teammate...</option>
                    {interns
                      .filter(i => i.id !== currentUser?.id)
                      .map(intern => (
                        <option key={intern.id} value={intern.id} className="bg-dark-card">
                          {intern.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-2">
                    What did they do? <span className="text-accent-coral">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Helped me debug the API, crushed that presentation..."
                    rows={3}
                    required
                    minLength={10}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted/50 resize-none focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-light/80 mb-3">
                    Category <span className="text-text-muted/50">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <motion.button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                          category === cat.value
                            ? 'bg-brand-green text-dark-pure font-medium'
                            : 'bg-white/5 border border-white/10 text-text-light hover:border-white/20'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={sending || !toInternId || !message}
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-yellow to-brand-yellow/80 hover:from-brand-yellow hover:to-brand-yellow text-dark-pure font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20"
                >
                  {sending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-dark-pure/30 border-t-dark-pure rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🎉</span>
                      Send High Five
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
