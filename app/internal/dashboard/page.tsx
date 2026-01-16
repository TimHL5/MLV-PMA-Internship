'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Intern {
  id: number;
  name: string;
}

interface Sprint {
  id: number;
  name: string;
}

interface Submission {
  id: number;
  intern_id: number;
  sprint_id: number;
  goals: string;
  deliverables: string;
  blockers: string | null;
  reflection: string | null;
  submitted_at: string;
  intern_name: string;
  sprint_name: string;
}

interface Stats {
  totalInterns: number;
  submittedThisSprint: number;
  totalSubmissions: number;
  missingSubmissions: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filters
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('');

  // Add new intern/sprint modals
  const [showAddIntern, setShowAddIntern] = useState(false);
  const [showAddSprint, setShowAddSprint] = useState(false);
  const [newInternName, setNewInternName] = useState('');
  const [newInternEmail, setNewInternEmail] = useState('');
  const [newSprintName, setNewSprintName] = useState('');

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIntern, selectedSprint]);

  const fetchInitialData = async () => {
    try {
      const [internsRes, sprintsRes] = await Promise.all([
        fetch('/api/internal/interns'),
        fetch('/api/internal/sprints'),
      ]);

      if (internsRes.status === 401) {
        router.push('/internal');
        return;
      }

      const internsData = await internsRes.json();
      const sprintsData = await sprintsRes.json();

      setInterns(internsData);
      setSprints(sprintsData);
    } catch (err) {
      console.error('Failed to load data');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedIntern) params.set('internId', selectedIntern);
      if (selectedSprint) params.set('sprintId', selectedSprint);
      params.set('stats', 'true');

      const response = await fetch(`/api/internal/submissions?${params}`);
      if (response.status === 401) {
        router.push('/internal');
        return;
      }

      const data = await response.json();
      setSubmissions(data.submissions);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/internal/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newInternName, email: newInternEmail }),
      });

      if (response.ok) {
        const newIntern = await response.json();
        setInterns(prev => [...prev, newIntern].sort((a, b) => a.name.localeCompare(b.name)));
        setNewInternName('');
        setNewInternEmail('');
        setShowAddIntern(false);
      }
    } catch (err) {
      console.error('Failed to add intern');
    }
  };

  const handleAddSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/internal/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSprintName }),
      });

      if (response.ok) {
        const newSprint = await response.json();
        setSprints(prev => [newSprint, ...prev]);
        setNewSprintName('');
        setShowAddSprint(false);
      }
    } catch (err) {
      console.error('Failed to add sprint');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/internal/auth', { method: 'DELETE' });
    router.push('/internal');
  };

  const exportToCSV = () => {
    const headers = ['Intern', 'Sprint', 'Goals', 'Deliverables', 'Blockers', 'Reflection', 'Submitted'];
    const rows = submissions.map(s => [
      s.intern_name,
      s.sprint_name,
      `"${s.goals.replace(/"/g, '""')}"`,
      `"${s.deliverables.replace(/"/g, '""')}"`,
      `"${(s.blockers || '').replace(/"/g, '""')}"`,
      `"${(s.reflection || '').replace(/"/g, '""')}"`,
      new Date(s.submitted_at).toLocaleString(),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mlv-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-dark-pure">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-pure via-dark-lighter to-dark-pure opacity-50" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(106,198,112,0.03)_1px,transparent_1px),linear_gradient(90deg,rgba(106,198,112,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-brand-green/20 bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/MLV Logo (white).png"
              alt="MLV Logo"
              width={80}
              height={32}
              className="object-contain"
            />
            <span className="text-text-muted text-sm hidden sm:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/internal/submit"
              className="text-brand-green hover:text-primary-light text-sm transition-colors"
            >
              Submit Update
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
              <p className="text-text-muted text-sm mb-1">Total Interns</p>
              <p className="text-3xl font-bold text-light-DEFAULT">{stats.totalInterns}</p>
            </div>
            <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
              <p className="text-text-muted text-sm mb-1">Submitted</p>
              <p className="text-3xl font-bold text-brand-green">{stats.submittedThisSprint}</p>
            </div>
            <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
              <p className="text-text-muted text-sm mb-1">Missing</p>
              <p className="text-3xl font-bold text-brand-yellow">{stats.missingSubmissions}</p>
            </div>
            <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4">
              <p className="text-text-muted text-sm mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-light-DEFAULT">{stats.totalSubmissions}</p>
            </div>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filters */}
            <div className="flex-1 flex flex-wrap gap-3">
              <select
                value={selectedIntern}
                onChange={(e) => setSelectedIntern(e.target.value)}
                className="px-4 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg 
                         text-light-DEFAULT text-sm
                         focus:outline-none focus:border-brand-green"
              >
                <option value="">All Interns</option>
                {interns.map(intern => (
                  <option key={intern.id} value={intern.id}>{intern.name}</option>
                ))}
              </select>

              <select
                value={selectedSprint}
                onChange={(e) => setSelectedSprint(e.target.value)}
                className="px-4 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg 
                         text-light-DEFAULT text-sm
                         focus:outline-none focus:border-brand-green"
              >
                <option value="">All Sprints</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddIntern(true)}
                className="px-3 py-2 bg-brand-green/10 border border-brand-green/30 rounded-lg
                         text-brand-green text-sm hover:bg-brand-green/20 transition-colors"
              >
                + Intern
              </button>
              <button
                onClick={() => setShowAddSprint(true)}
                className="px-3 py-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg
                         text-brand-yellow text-sm hover:bg-brand-yellow/20 transition-colors"
              >
                + Sprint
              </button>
              <button
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="px-3 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                         text-text-light text-sm hover:bg-dark-pure/80 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-muted">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-pure/50 border-b border-brand-green/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Intern</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Sprint</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Goals</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">Deliverables</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/10">
                  {submissions.map(submission => (
                    <>
                      <tr 
                        key={submission.id}
                        className="hover:bg-dark-pure/30 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                      >
                        <td className="px-4 py-4">
                          <span className="text-light-DEFAULT font-medium">{submission.intern_name}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-brand-green text-sm">{submission.sprint_name}</span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-text-muted text-sm line-clamp-1">{submission.goals}</span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-text-muted text-sm line-clamp-1">{submission.deliverables}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-text-muted text-sm">{formatDate(submission.submitted_at)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <svg 
                            className={`w-5 h-5 text-text-muted transition-transform ${expandedId === submission.id ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </td>
                      </tr>
                      {expandedId === submission.id && (
                        <tr key={`${submission.id}-expanded`}>
                          <td colSpan={6} className="px-4 py-4 bg-dark-pure/30">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-brand-green uppercase mb-2">Goals</h4>
                                <p className="text-text-light text-sm whitespace-pre-wrap">{submission.goals}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-brand-green uppercase mb-2">Deliverables</h4>
                                <p className="text-text-light text-sm whitespace-pre-wrap">{submission.deliverables}</p>
                              </div>
                              {submission.blockers && (
                                <div>
                                  <h4 className="text-xs font-medium text-brand-yellow uppercase mb-2">Blockers</h4>
                                  <p className="text-text-light text-sm whitespace-pre-wrap">{submission.blockers}</p>
                                </div>
                              )}
                              {submission.reflection && (
                                <div>
                                  <h4 className="text-xs font-medium text-accent-purple uppercase mb-2">Reflection</h4>
                                  <p className="text-text-light text-sm whitespace-pre-wrap">{submission.reflection}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Intern Modal */}
      {showAddIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-light-DEFAULT mb-4">Add New Intern</h2>
            <form onSubmit={handleAddIntern} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Name *</label>
                <input
                  type="text"
                  value={newInternName}
                  onChange={(e) => setNewInternName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl 
                           text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={newInternEmail}
                  onChange={(e) => setNewInternEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl 
                           text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddIntern(false)}
                  className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-brand-green text-dark-pure font-semibold rounded-xl hover:bg-primary-dark"
                >
                  Add Intern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sprint Modal */}
      {showAddSprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-light-DEFAULT mb-4">Add New Sprint</h2>
            <form onSubmit={handleAddSprint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Sprint Name *</label>
                <input
                  type="text"
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  placeholder="e.g., Sprint 1 - Jan 15-22"
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl 
                           text-light-DEFAULT placeholder-text-muted focus:outline-none focus:border-brand-green"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSprint(false)}
                  className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-brand-yellow text-dark-pure font-semibold rounded-xl hover:bg-secondary-dark"
                >
                  Add Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
