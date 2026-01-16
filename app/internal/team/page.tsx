'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';
import { motion, AnimatePresence } from 'framer-motion';

// Professional Icons
const Icons = {
  sparkles: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  handshake: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l-.075 5.925m3.075-5.925v3.75a1.575 1.575 0 003.15 0V4.575m-3.15 4.5V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  rocket: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  puzzle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  trophy: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
};

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
  { value: 'teamwork', label: 'Teamwork', icon: Icons.handshake, color: 'accent-teal' },
  { value: 'creativity', label: 'Creativity', icon: Icons.lightbulb, color: 'brand-yellow' },
  { value: 'hustle', label: 'Hustle', icon: Icons.rocket, color: 'accent-coral' },
  { value: 'problem-solving', label: 'Problem Solving', icon: Icons.puzzle, color: 'accent-purple' },
  { value: 'communication', label: 'Communication', icon: Icons.chat, color: 'brand-green' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -16,
    transition: { duration: 0.2 },
  },
};

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.03] rounded-2xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
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
    return CATEGORIES.find(c => c.value === cat) || { icon: Icons.sparkles, color: 'brand-yellow' };
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-12 w-44" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-[500px]" />
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
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
              {Icons.sparkles}
            </div>
            Team Recognition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 mt-2"
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
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-yellow hover:bg-brand-yellow/90 text-[#0a0a0a] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-brand-yellow/80">{Icons.sparkles}</span>
          Give Recognition
        </motion.button>
      </motion.div>

      {/* Category Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat, index) => {
          const count = highFives.filter(hf => hf.category === cat.value).length;
          return (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl p-4 text-center group hover:border-white/[0.1] transition-all duration-300"
            >
              <div className={`w-10 h-10 mx-auto rounded-xl bg-${cat.color}/10 flex items-center justify-center text-${cat.color} mb-3 group-hover:scale-105 transition-transform duration-200`}>
                {cat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-white/40 text-xs mt-1">{cat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* High Fives Feed */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-[#111111] border border-white/[0.06] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recognition Feed</h2>
          <span className="text-white/30 text-sm">{highFives.length} high fives</span>
        </div>

        {highFives.length > 0 ? (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {highFives.map((hf, index) => {
                const catInfo = getCategoryInfo(hf.category);
                const catData = CATEGORIES.find(c => c.value === hf.category);
                return (
                  <motion.div
                    key={hf.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    transition={{ delay: index * 0.02 }}
                    className="group bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-5 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category icon */}
                      <div className={`w-12 h-12 rounded-xl bg-${catInfo.color}/10 flex items-center justify-center text-${catInfo.color} flex-shrink-0`}>
                        {catInfo.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm flex items-center gap-2">
                            <span className="text-brand-yellow font-semibold">{hf.from_intern_name}</span>
                            <span className="text-white/20">{Icons.arrow}</span>
                            <span className="text-brand-green font-semibold">{hf.to_intern_name}</span>
                          </p>
                          <span className="text-white/30 text-xs whitespace-nowrap">{formatTimeAgo(hf.created_at)}</span>
                        </div>

                        {/* Message */}
                        <p className="text-white/70 text-sm leading-relaxed">
                          &quot;{hf.message}&quot;
                        </p>

                        {/* Category tag */}
                        {hf.category && catData && (
                          <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-${catInfo.color}/10 text-${catInfo.color} text-xs rounded-lg font-medium border border-${catInfo.color}/20`}>
                            <span className="w-3.5 h-3.5">{catData.icon}</span>
                            {catData.label}
                          </span>
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
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/20">
              {Icons.trophy}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No recognition yet</h3>
            <p className="text-white/40 mb-6 max-w-sm mx-auto">
              Be the first to recognize a teammate&apos;s great work.
            </p>
            <motion.button
              onClick={() => setShowModal(true)}
              disabled={!currentUser}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-[#0a0a0a] font-semibold rounded-xl hover:bg-brand-yellow/90 transition-colors disabled:opacity-50"
            >
              {Icons.sparkles}
              Give First Recognition
            </motion.button>
          </motion.div>
        )}
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-[#111111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Success state */}
              <AnimatePresence>
                {justSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-[#111111] rounded-2xl flex flex-col items-center justify-center z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-4"
                    >
                      {Icons.check}
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-semibold text-white"
                    >
                      Recognition Sent!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-brand-yellow">{Icons.sparkles}</span>
                  Give Recognition
                </h2>
                <motion.button
                  onClick={() => setShowModal(false)}
                  disabled={sending}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                >
                  {Icons.close}
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Who are you recognizing? <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={toInternId}
                    onChange={(e) => setToInternId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/30 transition-all"
                  >
                    <option value="" className="bg-[#111111]">Select teammate...</option>
                    {interns
                      .filter(i => i.id !== currentUser?.id)
                      .map(intern => (
                        <option key={intern.id} value={intern.id} className="bg-[#111111]">
                          {intern.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    What did they do? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Helped me debug the API, crushed that presentation..."
                    rows={3}
                    required
                    minLength={10}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/30 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">
                    Category <span className="text-white/30">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <motion.button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                          category === cat.value
                            ? 'bg-brand-green text-[#0a0a0a] font-medium'
                            : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:border-white/[0.15]'
                        }`}
                      >
                        <span className="w-4 h-4">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={sending || !toInternId || !message}
                  whileHover={{ scale: sending ? 1 : 1.01 }}
                  whileTap={{ scale: sending ? 1 : 0.99 }}
                  className="w-full py-3.5 px-4 bg-brand-yellow hover:bg-brand-yellow/90 text-[#0a0a0a] font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      {Icons.sparkles}
                      Send Recognition
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
