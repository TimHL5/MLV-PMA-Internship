'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Intern {
  id: number;
  name: string;
  email: string | null;
}

interface Sprint {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
}

export default function SubmitPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [internsRes, sprintsRes] = await Promise.all([
        fetch('/api/internal/interns'),
        fetch('/api/internal/sprints'),
      ]);

      if (internsRes.status === 401 || sprintsRes.status === 401) {
        router.push('/internal');
        return;
      }

      const internsData = await internsRes.json();
      const sprintsData = await sprintsRes.json();

      setInterns(internsData);
      setSprints(sprintsData);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

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
          blockers: formData.blockers,
          reflection: formData.reflection,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          internId: '',
          sprintId: '',
          goals: '',
          deliverables: '',
          blockers: '',
          reflection: '',
        });
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

  const handleLogout = async () => {
    await fetch('/api/internal/auth', { method: 'DELETE' });
    router.push('/internal');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-pure flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-pure">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-pure via-dark-lighter to-dark-pure opacity-50" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(106,198,112,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-brand-green/20 bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/MLV Logo (white).png"
              alt="MLV Logo"
              width={80}
              height={32}
              className="object-contain"
            />
            <span className="text-text-muted text-sm hidden sm:block">Intern Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/internal/dashboard"
              className="text-brand-green hover:text-primary-light text-sm transition-colors"
            >
              View Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-accent-coral text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-light-DEFAULT mb-2">
              Weekly Progress Update
            </h1>
            <p className="text-text-muted text-sm">
              Submit your goals and deliverables for this sprint
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-brand-green font-medium">Submission successful!</p>
                  <p className="text-text-muted text-sm">Your progress update has been recorded.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-accent-coral/10 border border-accent-coral/30 rounded-xl">
              <p className="text-accent-coral text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Intern Selection */}
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
                      {sprint.name}
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
              <p className="text-text-muted text-xs mt-1">Minimum 10 characters</p>
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
              <p className="text-text-muted text-xs mt-1">Minimum 10 characters</p>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !formData.internId || !formData.sprintId}
              className="w-full py-4 px-6 bg-brand-green hover:bg-primary-dark 
                       text-dark-pure font-semibold rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 transform hover:scale-[1.02]
                       shadow-glow-green hover:shadow-glow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Progress Update'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
