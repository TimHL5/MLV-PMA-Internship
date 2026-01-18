'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useTeam } from '@/components/providers';
import { CoffeeChat, Profile } from '@/lib/types';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Coffee,
  Shuffle,
  Check,
  Calendar,
  MessageSquare,
  X,
} from 'lucide-react';

interface CoffeeChatWithProfiles extends CoffeeChat {
  profile1: Profile;
  profile2: Profile;
}

export default function CoffeeChatsPage() {
  const { user } = useAuth();
  const { team, members } = useTeam();
  const [chats, setChats] = useState<CoffeeChatWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<CoffeeChatWithProfiles | null>(null);
  const [notes, setNotes] = useState('');
  const supabase = createClient();

  const fetchChats = useCallback(async () => {
    if (!team || !user) return;

    try {
      const { data, error } = await supabase
        .from('coffee_chats')
        .select(`
          *,
          profile1:profiles!coffee_chats_profile1_id_fkey(*),
          profile2:profiles!coffee_chats_profile2_id_fkey(*)
        `)
        .eq('team_id', team.id)
        .or(`profile1_id.eq.${user.id},profile2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching coffee chats:', error);
    } finally {
      setLoading(false);
    }
  }, [team, user, supabase]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const generateNewMatch = async () => {
    if (!team || !user || members.length < 2) return;

    setGenerating(true);
    try {
      // Find available partners (exclude self and recent matches)
      const recentPartners = chats
        .filter((c) => c.status === 'pending' || c.status === 'scheduled')
        .map((c) => (c.profile1_id === user.id ? c.profile2_id : c.profile1_id));

      const availableMembers = members.filter(
        (m) => m.profile_id !== user.id && !recentPartners.includes(m.profile_id)
      );

      if (availableMembers.length === 0) {
        toast.error('No available partners for a new match');
        return;
      }

      // Randomly select a partner
      const randomPartner =
        availableMembers[Math.floor(Math.random() * availableMembers.length)];

      const { error } = await supabase.from('coffee_chats').insert({
        team_id: team.id,
        profile1_id: user.id,
        profile2_id: randomPartner.profile_id,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('New coffee chat matched!');
      fetchChats();
    } catch (error) {
      console.error('Error generating match:', error);
      toast.error('Failed to generate match');
    } finally {
      setGenerating(false);
    }
  };

  const markCompleted = async () => {
    if (!selectedChat) return;

    try {
      const { error } = await supabase
        .from('coffee_chats')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          notes: notes.trim() || null,
        })
        .eq('id', selectedChat.id);

      if (error) throw error;

      toast.success('Coffee chat marked as completed!');
      setShowCompleteModal(false);
      setSelectedChat(null);
      setNotes('');
      fetchChats();
    } catch (error) {
      console.error('Error completing chat:', error);
      toast.error('Failed to update status');
    }
  };

  const skipChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('coffee_chats')
        .update({ status: 'skipped' })
        .eq('id', chatId);

      if (error) throw error;

      toast.success('Chat skipped');
      fetchChats();
    } catch (error) {
      console.error('Error skipping chat:', error);
      toast.error('Failed to skip chat');
    }
  };

  const openCompleteModal = (chat: CoffeeChatWithProfiles) => {
    setSelectedChat(chat);
    setShowCompleteModal(true);
  };

  const getPartner = (chat: CoffeeChatWithProfiles) => {
    return chat.profile1_id === user?.id ? chat.profile2 : chat.profile1;
  };

  const pendingChats = chats.filter((c) => c.status === 'pending' || c.status === 'scheduled');
  const completedChats = chats.filter((c) => c.status === 'completed');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-dark-card/50 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
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
            <Coffee className="w-6 h-6 text-brand-yellow" />
            Coffee Chats
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Connect with teammates over virtual coffee
          </p>
        </div>
        <button
          onClick={generateNewMatch}
          disabled={generating || members.length < 2}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5
                   bg-brand-yellow hover:bg-secondary-dark text-dark-pure font-medium rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
              Matching...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4" />
              Get New Match
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-light-DEFAULT">{pendingChats.length}</p>
          <p className="text-xs text-text-muted">Pending</p>
        </div>
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-light-DEFAULT">{completedChats.length}</p>
          <p className="text-xs text-text-muted">Completed</p>
        </div>
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-light-DEFAULT">{chats.length}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
      </div>

      {/* Pending Chats */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-light-DEFAULT mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-yellow" />
          Pending Coffee Chats
        </h2>

        {pendingChats.length > 0 ? (
          <div className="space-y-4">
            {pendingChats.map((chat) => {
              const partner = getPartner(chat);
              return (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-4 bg-dark-pure/50 rounded-xl border border-brand-green/10"
                >
                  <div className="flex items-center gap-4">
                    {partner?.avatar_url ? (
                      <Image
                        src={partner.avatar_url}
                        alt={partner.full_name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                        <span className="text-brand-yellow font-medium text-lg">
                          {partner?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-light-DEFAULT">
                        {partner?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-text-muted">
                        Matched{' '}
                        {formatDistanceToNow(new Date(chat.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                      {partner?.location && (
                        <p className="text-xs text-text-muted mt-0.5">
                          📍 {partner.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => skipChat(chat.id)}
                      className="p-2 text-text-muted hover:text-accent-coral transition-colors"
                      title="Skip"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openCompleteModal(chat)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-brand-green/10 text-brand-green
                               rounded-lg hover:bg-brand-green/20 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">☕</div>
            <p className="text-text-muted mb-4">No pending coffee chats</p>
            <button
              onClick={generateNewMatch}
              disabled={generating || members.length < 2}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-dark-pure font-medium rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              Get a Match
            </button>
          </div>
        )}
      </div>

      {/* Completed Chats */}
      {completedChats.length > 0 && (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-light-DEFAULT mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-brand-green" />
            Completed Chats
          </h2>

          <div className="space-y-3">
            {completedChats.map((chat) => {
              const partner = getPartner(chat);
              return (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-3 bg-dark-pure/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {partner?.avatar_url ? (
                      <Image
                        src={partner.avatar_url}
                        alt={partner.full_name}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand-green/20 flex items-center justify-center">
                        <span className="text-brand-green font-medium">
                          {partner?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-light-DEFAULT">
                        {partner?.full_name || 'Unknown'}
                      </p>
                      {chat.completed_at && (
                        <p className="text-xs text-text-muted">
                          {format(new Date(chat.completed_at), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                  {chat.notes && (
                    <span title="Has notes">
                      <MessageSquare className="w-4 h-4 text-text-muted" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-pure/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-brand-green/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-light-DEFAULT flex items-center gap-2">
                <Coffee className="w-5 h-5 text-brand-yellow" />
                Complete Coffee Chat
              </h2>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setSelectedChat(null);
                  setNotes('');
                }}
                className="text-text-muted hover:text-text-light p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-text-light">
                Great job connecting with{' '}
                <span className="text-brand-yellow font-medium">
                  {getPartner(selectedChat)?.full_name}
                </span>
                !
              </p>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Notes <span className="text-text-muted">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you discuss? Any follow-ups?"
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl
                           text-light-DEFAULT placeholder-text-muted resize-none
                           focus:outline-none focus:border-brand-green"
                />
              </div>

              <button
                onClick={markCompleted}
                className="w-full py-3 px-4 bg-brand-green hover:bg-primary-dark
                         text-dark-pure font-semibold rounded-xl transition-colors
                         flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
