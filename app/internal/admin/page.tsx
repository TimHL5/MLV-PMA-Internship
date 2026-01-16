'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '../layout';

interface Submission {
  id: number;
  intern_id: number;
  sprint_id: number;
  goals: string;
  deliverables: string;
  blockers: string | null;
  reflection: string | null;
  mood: number | null;
  hours_worked: number | null;
  submitted_at: string;
  intern_name: string;
  sprint_name: string;
}

interface OneOnOne {
  id: number;
  intern_id: number;
  intern_name: string;
  sprint_name: string | null;
  proud_of: string | null;
  need_help: string | null;
  questions: string | null;
  prep_submitted_at: string | null;
  admin_notes: string | null;
  action_items: string | null;
  meeting_completed_at: string | null;
}

export default function AdminPage() {
  const { currentUser, activeSprint, interns, sprints, refreshData } = usePortal();
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'one-on-ones' | 'coffee-chats' | 'manage'>('overview');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [oneOnOnes, setOneOnOnes] = useState<OneOnOne[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSprint, setSelectedSprint] = useState('');
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [selectedOneOnOne, setSelectedOneOnOne] = useState<OneOnOne | null>(null);

  // Admin notes form
  const [adminNotes, setAdminNotes] = useState('');
  const [actionItems, setActionItems] = useState('');

  // New intern/sprint form
  const [showAddIntern, setShowAddIntern] = useState(false);
  const [showAddSprint, setShowAddSprint] = useState(false);
  const [newInternForm, setNewInternForm] = useState({ name: '', email: '', location: '', role: 'intern' });
  const [newSprintForm, setNewSprintForm] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    if (activeSprint) {
      setSelectedSprint(activeSprint.id.toString());
    }
  }, [activeSprint]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSprint]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sprintId = selectedSprint || activeSprint?.id;

      const [submissionsRes, oneOnOnesRes] = await Promise.all([
        fetch(`/api/internal/submissions${sprintId ? `?sprintId=${sprintId}` : ''}`),
        fetch(`/api/internal/one-on-ones${sprintId ? `?sprintId=${sprintId}` : ''}`),
      ]);

      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        setSubmissions(data.submissions || data);
      }

      if (oneOnOnesRes.ok) {
        const data = await oneOnOnesRes.json();
        setOneOnOnes(data);
      }
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoffeeChats = async () => {
    if (!activeSprint) return;

    try {
      const response = await fetch('/api/internal/coffee-chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', sprintId: activeSprint.id }),
      });

      if (response.ok) {
        alert('Coffee chat pairings generated!');
      }
    } catch (error) {
      console.error('Failed to generate pairings');
    }
  };

  const handleSetActiveSprint = async (sprintId: number) => {
    try {
      await fetch(`/api/internal/sprints/${sprintId}/activate`, { method: 'POST' });
      refreshData();
    } catch (error) {
      console.error('Failed to set active sprint');
    }
  };

  const handleAddIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/internal/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInternForm),
      });

      if (response.ok) {
        setShowAddIntern(false);
        setNewInternForm({ name: '', email: '', location: '', role: 'intern' });
        refreshData();
      }
    } catch (error) {
      console.error('Failed to add intern');
    }
  };

  const handleAddSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/internal/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSprintForm),
      });

      if (response.ok) {
        setShowAddSprint(false);
        setNewSprintForm({ name: '', startDate: '', endDate: '' });
        refreshData();
      }
    } catch (error) {
      console.error('Failed to add sprint');
    }
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedOneOnOne) return;

    try {
      await fetch(`/api/internal/one-on-ones/${selectedOneOnOne.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes, actionItems }),
      });

      setSelectedOneOnOne(null);
      setAdminNotes('');
      setActionItems('');
      fetchData();
    } catch (error) {
      console.error('Failed to save notes');
    }
  };

  const exportCSV = () => {
    const headers = ['Intern', 'Sprint', 'Goals', 'Deliverables', 'Blockers', 'Reflection', 'Mood', 'Hours', 'Submitted'];
    const rows = submissions.map(s => [
      s.intern_name,
      s.sprint_name,
      `"${s.goals.replace(/"/g, '""')}"`,
      `"${s.deliverables.replace(/"/g, '""')}"`,
      `"${(s.blockers || '').replace(/"/g, '""')}"`,
      `"${(s.reflection || '').replace(/"/g, '""')}"`,
      s.mood || '',
      s.hours_worked || '',
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

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-accent-coral/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-accent-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-light-DEFAULT mb-2">Admin Access Required</h2>
        <p className="text-text-muted text-center max-w-md">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT">Admin Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Manage interns, sprints, and view all data
          </p>
        </div>

        <select
          value={selectedSprint}
          onChange={(e) => setSelectedSprint(e.target.value)}
          className="px-4 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                   text-light-DEFAULT focus:outline-none focus:border-brand-green"
        >
          <option value="">All Sprints</option>
          {sprints.map(sprint => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name} {sprint.is_active ? '(Active)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-brand-green/20 pb-4">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'submissions', label: 'Submissions' },
          { id: 'one-on-ones', label: '1:1 Notes' },
          { id: 'coffee-chats', label: 'Coffee Chats' },
          { id: 'manage', label: 'Manage' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-brand-green text-dark-pure'
                : 'text-text-muted hover:text-text-light hover:bg-dark-lighter'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Total Interns</p>
            <p className="text-3xl font-bold text-light-DEFAULT">{interns.length}</p>
          </div>
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Active Sprint</p>
            <p className="text-xl font-bold text-brand-green">{activeSprint?.name || 'None'}</p>
          </div>
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">Submissions</p>
            <p className="text-3xl font-bold text-brand-yellow">{submissions.length}</p>
          </div>
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-4">
            <p className="text-text-muted text-sm mb-1">1:1 Preps</p>
            <p className="text-3xl font-bold text-accent-teal">
              {oneOnOnes.filter(o => o.prep_submitted_at).length}
            </p>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-brand-green/10 flex justify-between items-center">
            <h2 className="font-semibold text-light-DEFAULT">All Submissions</h2>
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm rounded-lg hover:bg-brand-green/20"
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-text-muted">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No submissions found</div>
          ) : (
            <div className="divide-y divide-brand-green/10">
              {submissions.map(submission => (
                <div key={submission.id}>
                  <div
                    className="p-4 hover:bg-dark-pure/30 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-medium">
                        {submission.intern_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-light-DEFAULT font-medium">{submission.intern_name}</p>
                        <p className="text-text-muted text-sm">{submission.sprint_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {submission.mood && (
                        <span className="text-sm text-text-muted">
                          Mood: {submission.mood}/5
                        </span>
                      )}
                      <span className="text-text-muted text-sm">
                        {formatDate(submission.submitted_at)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-text-muted transition-transform ${expandedSubmission === submission.id ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expandedSubmission === submission.id && (
                    <div className="px-4 pb-4 bg-dark-pure/30">
                      <div className="grid md:grid-cols-2 gap-4 pl-14">
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 1:1 Notes Tab */}
      {activeTab === 'one-on-ones' && (
        <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-brand-green/10">
            <h2 className="font-semibold text-light-DEFAULT">1:1 Preps & Notes</h2>
            <p className="text-text-muted text-sm">View intern preps and add private notes</p>
          </div>

          <div className="divide-y divide-brand-green/10">
            {oneOnOnes.map(o => (
              <div key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal font-medium">
                      {o.intern_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-light-DEFAULT font-medium">{o.intern_name}</p>
                      <p className="text-text-muted text-sm">{o.sprint_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOneOnOne(o);
                      setAdminNotes(o.admin_notes || '');
                      setActionItems(o.action_items || '');
                    }}
                    className="px-3 py-1.5 bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm rounded-lg hover:bg-brand-green/20"
                  >
                    Add Notes
                  </button>
                </div>

                {o.prep_submitted_at && (
                  <div className="mt-4 pl-13 grid md:grid-cols-3 gap-4">
                    {o.proud_of && (
                      <div className="bg-dark-pure/50 rounded-lg p-3">
                        <p className="text-text-muted text-xs uppercase mb-1">Proud of</p>
                        <p className="text-text-light text-sm">{o.proud_of}</p>
                      </div>
                    )}
                    {o.need_help && (
                      <div className="bg-dark-pure/50 rounded-lg p-3">
                        <p className="text-text-muted text-xs uppercase mb-1">Need help</p>
                        <p className="text-text-light text-sm">{o.need_help}</p>
                      </div>
                    )}
                    {o.questions && (
                      <div className="bg-dark-pure/50 rounded-lg p-3">
                        <p className="text-text-muted text-xs uppercase mb-1">Questions</p>
                        <p className="text-text-light text-sm">{o.questions}</p>
                      </div>
                    )}
                  </div>
                )}

                {!o.prep_submitted_at && (
                  <p className="mt-2 pl-13 text-text-muted text-sm">No prep submitted yet</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coffee Chats Tab */}
      {activeTab === 'coffee-chats' && (
        <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-6">
          <h2 className="font-semibold text-light-DEFAULT mb-4">Coffee Chat Pairings</h2>

          <button
            onClick={handleGenerateCoffeeChats}
            className="px-4 py-2 bg-brand-yellow hover:bg-secondary-dark text-dark-pure font-medium rounded-lg transition-colors"
          >
            Generate New Pairings for {activeSprint?.name}
          </button>

          <p className="text-text-muted text-sm mt-4">
            This will randomly pair all interns for coffee chats this sprint.
            Previous pairings will be considered to avoid repeats.
          </p>
        </div>
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Interns */}
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-light-DEFAULT">Interns ({interns.length})</h2>
              <button
                onClick={() => setShowAddIntern(true)}
                className="px-3 py-1.5 bg-brand-green text-dark-pure text-sm font-medium rounded-lg hover:bg-primary-dark"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {interns.map(intern => (
                <div key={intern.id} className="flex items-center gap-3 p-2 bg-dark-pure/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm">
                    {intern.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-light text-sm truncate">{intern.name}</p>
                    {intern.location && (
                      <p className="text-text-muted text-xs">{intern.location}</p>
                    )}
                  </div>
                  {intern.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-brand-yellow/20 text-brand-yellow text-xs rounded">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sprints */}
          <div className="bg-dark-card/80 border border-brand-green/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-light-DEFAULT">Sprints ({sprints.length})</h2>
              <button
                onClick={() => setShowAddSprint(true)}
                className="px-3 py-1.5 bg-brand-yellow text-dark-pure text-sm font-medium rounded-lg hover:bg-secondary-dark"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {sprints.map(sprint => (
                <div key={sprint.id} className="flex items-center justify-between p-2 bg-dark-pure/50 rounded-lg">
                  <div>
                    <p className="text-text-light text-sm">{sprint.name}</p>
                    {sprint.start_date && (
                      <p className="text-text-muted text-xs">
                        {new Date(sprint.start_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {sprint.is_active ? (
                    <span className="px-2 py-0.5 bg-brand-green/20 text-brand-green text-xs rounded">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetActiveSprint(sprint.id)}
                      className="px-2 py-0.5 text-text-muted text-xs hover:text-brand-green"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  value={newInternForm.name}
                  onChange={(e) => setNewInternForm({ ...newInternForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Email</label>
                <input
                  type="email"
                  value={newInternForm.email}
                  onChange={(e) => setNewInternForm({ ...newInternForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Location</label>
                <input
                  type="text"
                  value={newInternForm.location}
                  onChange={(e) => setNewInternForm({ ...newInternForm, location: e.target.value })}
                  placeholder="Hong Kong, HCMC, etc."
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT placeholder-text-muted focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Role</label>
                <select
                  value={newInternForm.role}
                  onChange={(e) => setNewInternForm({ ...newInternForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT focus:outline-none focus:border-brand-green"
                >
                  <option value="intern">Intern</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddIntern(false)} className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-brand-green text-dark-pure font-semibold rounded-xl hover:bg-primary-dark">
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
                <label className="block text-sm font-medium text-text-light mb-2">Name *</label>
                <input
                  type="text"
                  value={newSprintForm.name}
                  onChange={(e) => setNewSprintForm({ ...newSprintForm, name: e.target.value })}
                  placeholder="Sprint 1 - Jan 15-22"
                  required
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT placeholder-text-muted focus:outline-none focus:border-brand-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newSprintForm.startDate}
                    onChange={(e) => setNewSprintForm({ ...newSprintForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT focus:outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">End Date</label>
                  <input
                    type="date"
                    value={newSprintForm.endDate}
                    onChange={(e) => setNewSprintForm({ ...newSprintForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddSprint(false)} className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-brand-yellow text-dark-pure font-semibold rounded-xl hover:bg-secondary-dark">
                  Add Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Notes Modal */}
      {selectedOneOnOne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-light-DEFAULT mb-2">
              Notes for {selectedOneOnOne.intern_name}
            </h2>
            <p className="text-text-muted text-sm mb-4">
              Private notes (not visible to intern)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT resize-none focus:outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Action Items</label>
                <textarea
                  value={actionItems}
                  onChange={(e) => setActionItems(e.target.value)}
                  rows={3}
                  placeholder="Follow up on X, connect them with Y..."
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl text-light-DEFAULT placeholder-text-muted resize-none focus:outline-none focus:border-brand-green"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedOneOnOne(null)}
                  className="flex-1 py-3 px-4 border border-brand-green/30 rounded-xl text-text-light hover:bg-dark-pure/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdminNotes}
                  className="flex-1 py-3 px-4 bg-brand-green text-dark-pure font-semibold rounded-xl hover:bg-primary-dark"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
