'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Organization, Team, TeamMember, Sprint, TeamContextType } from '@/lib/types';
import { useAuth } from './AuthProvider';

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
  orgSlug: string;
  teamSlug: string;
}

export function TeamProvider({ children, orgSlug, teamSlug }: TeamProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchTeamData = useCallback(async () => {
    // Don't fetch if auth is still loading
    if (authLoading) return;

    // If no user after auth is done, stop loading
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', orgSlug)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        setError(`Organization "${orgSlug}" not found`);
        setLoading(false);
        return;
      }

      setOrganization(orgData);

      // Fetch team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', orgData.id)
        .eq('slug', teamSlug)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        setError(`Team "${teamSlug}" not found`);
        setLoading(false);
        return;
      }

      setTeam(teamData);

      // Fetch team members with profiles
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('team_id', teamData.id);

      if (membersError) {
        console.error('Error fetching members:', membersError);
      } else {
        setMembers(membersData || []);
      }

      // Fetch sprints
      const { data: sprintsData, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .eq('team_id', teamData.id)
        .order('start_date', { ascending: false });

      if (sprintsError) {
        console.error('Error fetching sprints:', sprintsError);
      } else {
        setSprints(sprintsData || []);
        // Set current active sprint
        const activeSprint = sprintsData?.find((s: Sprint) => s.is_active);
        setCurrentSprint(activeSprint || sprintsData?.[0] || null);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  }, [authLoading, user, orgSlug, teamSlug, supabase]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const refetch = async () => {
    await fetchTeamData();
  };

  return (
    <TeamContext.Provider
      value={{
        organization,
        team,
        members,
        currentSprint,
        sprints,
        loading: loading || authLoading,
        refetch,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
