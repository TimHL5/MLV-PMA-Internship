'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { OneOnOneNote } from '@/lib/types';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Trophy,
  Mountain,
  MessageCircle,
  CheckSquare,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function OneOnOnePage() {
  const { user } = useAuth();
  const { team, currentSprint } = useTeam();
  const [notes, setNotes] = useState<OneOnOneNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  // Form state
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [discussionTopics, setDiscussionTopics] = useState('');
  const [actionItems, setActionItems] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!team || !user) return;

    try {
      const { data, error } = await supabase
        .from('one_on_one_notes')
        .select('*')
        .eq('team_id', team.id)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);

      // Auto-expand latest if exists
      if (data && data.length > 0) {
        setExpandedId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [team, user, supabase]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !team) return;

    if (wins.trim().length < 5 || challenges.trim().length < 5 || discussionTopics.trim().length < 5) {
      toast.error('Please fill in all required fields (min 5 characters each)');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('one_on_one_notes')
          .update({
            wins: wins.trim(),
            challenges: challenges.trim(),
            discussion_topics: discussionTopics.trim(),
            action_items: actionItems.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Notes updated');
      } else {
        // Create new
        const { error } = await supabase.from('one_on_one_notes').insert({
          team_id: team.id,
          profile_id: user.id,
          sprint_id: currentSprint?.id || null,
          wins: wins.trim(),
          challenges: challenges.trim(),
          discussion_topics: discussionTopics.trim(),
          action_items: actionItems.trim() || null,
          is_private: false,
        });

        if (error) throw error;
        toast.success('1:1 prep submitted');
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setWins('');
    setChallenges('');
    setDiscussionTopics('');
    setActionItems('');
    setShowForm(false);
    setEditingId(null);
  };

  const startEditing = (note: OneOnOneNote) => {
    setWins(note.wins);
    setChallenges(note.challenges);
    setDiscussionTopics(note.discussion_topics);
    setActionItems(note.action_items || '');
    setEditingId(note.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-dark-card/50 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-dark-card/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-DEFAULT flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-brand-green" />
            1:1 Prep
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Prepare for your one-on-one meetings
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5
                     bg-brand-green hover:bg-primary-dark text-dark-pure font-medium rounded-xl
                     transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Prep
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-light-DEFAULT">
              {editingId ? 'Edit 1:1 Prep' : 'New 1:1 Prep'}
            </h2>
            <button
              onClick={resetForm}
              className="text-text-muted hover:text-text-light p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Wins */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-2">
                <Trophy className="w-4 h-4 text-brand-yellow" />
                What are you proud of? <span className="text-accent-coral">*</span>
              </label>
              <textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="Share your wins and accomplishments..."
                rows={3}
                required
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT placeholder-text-muted resize-none
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-2">
                <Mountain className="w-4 h-4 text-accent-coral" />
                What challenges are you facing? <span className="text-accent-coral">*</span>
              </label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Describe any blockers, difficulties, or areas where you need support..."
                rows={3}
                required
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT placeholder-text-muted resize-none
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
              />
            </div>

            {/* Discussion Topics */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-2">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                Topics to discuss <span className="text-accent-coral">*</span>
              </label>
              <textarea
                value={discussionTopics}
                onChange={(e) => setDiscussionTopics(e.target.value)}
                placeholder="Questions, ideas, feedback you want to discuss..."
                rows={3}
                required
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT placeholder-text-muted resize-none
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
              />
            </div>

            {/* Action Items */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-light mb-2">
                <CheckSquare className="w-4 h-4 text-brand-green" />
                Action items <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                placeholder="Follow-ups from last meeting, tasks to complete..."
                rows={2}
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                         text-light-DEFAULT placeholder-text-muted resize-none
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-dark-pure/50 border border-brand-green/30
                         text-text-light font-medium rounded-xl
                         hover:border-brand-green/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-4 bg-brand-green hover:bg-primary-dark
                         text-dark-pure font-semibold rounded-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                {saving ? (
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update' : 'Save Prep'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Previous Notes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-light-DEFAULT">Previous Preps</h2>

        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === note.id ? null : note.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-dark-pure/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-brand-green" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-light-DEFAULT">
                      {format(new Date(note.created_at), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatDistanceToNow(new Date(note.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {expandedId === note.id ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedId === note.id && (
                <div className="px-4 pb-4 space-y-4 border-t border-brand-green/10">
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-brand-yellow mb-2">
                      <Trophy className="w-3.5 h-3.5" />
                      WINS
                    </div>
                    <p className="text-sm text-text-light whitespace-pre-wrap">
                      {note.wins}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-accent-coral mb-2">
                      <Mountain className="w-3.5 h-3.5" />
                      CHALLENGES
                    </div>
                    <p className="text-sm text-text-light whitespace-pre-wrap">
                      {note.challenges}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-400 mb-2">
                      <MessageCircle className="w-3.5 h-3.5" />
                      DISCUSSION TOPICS
                    </div>
                    <p className="text-sm text-text-light whitespace-pre-wrap">
                      {note.discussion_topics}
                    </p>
                  </div>

                  {note.action_items && (
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-brand-green mb-2">
                        <CheckSquare className="w-3.5 h-3.5" />
                        ACTION ITEMS
                      </div>
                      <p className="text-sm text-text-light whitespace-pre-wrap">
                        {note.action_items}
                      </p>
                    </div>
                  )}

                  {note.manager_notes && (
                    <div className="pt-2 border-t border-brand-green/10">
                      <div className="text-xs font-medium text-purple-400 mb-2">
                        MANAGER NOTES
                      </div>
                      <p className="text-sm text-text-light whitespace-pre-wrap">
                        {note.manager_notes}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="inline-flex items-center gap-2 text-sm text-brand-green hover:text-primary-light transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-light-DEFAULT mb-2">
              No preps yet
            </h3>
            <p className="text-text-muted mb-4">
              Create your first 1:1 prep to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-dark-pure font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Prep
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
