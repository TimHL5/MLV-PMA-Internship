'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers';
import Image from 'next/image';
import { Building2, Users } from 'lucide-react';

interface TeamWithOrg {
  id: string;
  name: string;
  slug: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [teams, setTeams] = useState<TeamWithOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchUserTeams();
    }
  }, [user, authLoading]);

  const fetchUserTeams = async () => {
    if (!user) return;

    try {
      // Fetch teams the user belongs to
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams (
            id,
            name,
            slug,
            organization:organizations (
              id,
              name,
              slug
            )
          )
        `)
        .eq('profile_id', user.id);

      if (memberError) throw memberError;

      if (memberData && memberData.length > 0) {
        type MemberWithTeam = { teams: { id: string; name: string; slug: string; organization: { id: string; name: string; slug: string } } };
        const typedData = memberData as unknown as MemberWithTeam[];
        const teamsWithOrg: TeamWithOrg[] = typedData
          .filter((m) => m.teams)
          .map((m) => ({
            id: m.teams.id,
            name: m.teams.name,
            slug: m.teams.slug,
            organization: m.teams.organization,
          }));

        setTeams(teamsWithOrg);

        // If only one team, redirect directly
        if (teamsWithOrg.length === 1) {
          const team = teamsWithOrg[0];
          router.push(`/${team.organization.slug}/${team.slug}`);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-pure flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-dark-pure flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-brand-green" />
          </div>
          <h1 className="text-2xl font-bold text-light-DEFAULT mb-2">
            No Teams Found
          </h1>
          <p className="text-text-muted mb-6">
            You haven&apos;t been added to any teams yet. Please contact your team
            administrator to get access.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
            className="text-brand-green hover:text-primary-light transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Show team selection if multiple teams
  return (
    <div className="min-h-screen bg-dark-pure flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/MLV Logo (white).png"
            alt="MLV"
            width={100}
            height={40}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-light-DEFAULT mb-2">
            Select a Team
          </h1>
          <p className="text-text-muted">Choose which team to view</p>
        </div>

        <div className="space-y-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() =>
                router.push(`/${team.organization.slug}/${team.slug}`)
              }
              className="w-full p-4 bg-dark-card/80 border border-brand-green/20 rounded-xl
                       hover:border-brand-green/50 hover:bg-dark-card transition-all
                       flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <p className="font-medium text-light-DEFAULT">{team.name}</p>
                <p className="text-sm text-text-muted">{team.organization.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
