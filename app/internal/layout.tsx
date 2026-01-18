'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
}

interface Sprint {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

// Available teams
const TEAMS: Team[] = [
  { id: 'hcmc-bas', name: 'HCMC BAs', slug: 'hcmc-bas' },
  { id: 'hanoi-bas', name: 'Hanoi BAs', slug: 'hanoi-bas' },
  { id: 'hk-bas', name: 'HK BAs', slug: 'hk-bas' },
  { id: 'jakarta-bas', name: 'Jakarta BAs', slug: 'jakarta-bas' },
  { id: 'operation-leads', name: 'Operation Leads', slug: 'operation-leads' },
  { id: 'pm-interns', name: 'PM Interns', slug: 'pm-interns' },
  { id: 'founders', name: 'Founders', slug: 'founders' },
];

interface PortalContextType {
  user: User | null;
  profile: Profile | null;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  activeSprint: Sprint | null;
  teams: Team[];
  refreshData: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType>({
  user: null,
  profile: null,
  selectedTeam: null,
  setSelectedTeam: () => {},
  activeSprint: null,
  teams: TEAMS,
  refreshData: async () => {},
});

export const usePortal = () => useContext(PortalContext);

// Professional SVG Icons
const Icons = {
  home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  board: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  team: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  sparkles: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

const navItems = [
  { href: '/internal/home', icon: 'home', label: 'Dashboard' },
  { href: '/internal/me', icon: 'user', label: 'My Progress' },
  { href: '/internal/submit', icon: 'edit', label: 'Submit' },
  { href: '/internal/board', icon: 'board', label: 'Board' },
  { href: '/internal/team', icon: 'team', label: 'Recognition' },
  { href: '/internal/one-on-one', icon: 'calendar', label: '1:1 Prep' },
];

const adminItems = [
  { href: '/internal/admin', icon: 'settings', label: 'Admin' },
];

// Premium loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-green/30 to-brand-yellow/30 blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Spinner */}
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/5"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-green"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white/40 text-sm font-medium tracking-wide">Loading workspace</p>
        </motion.div>
      </div>
    </div>
  );
}

// Nav item component
function NavItem({
  item,
  isActive,
  onClick
}: {
  item: typeof navItems[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  const icon = Icons[item.icon as keyof typeof Icons];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="relative group block"
    >
      <motion.div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${isActive
            ? 'text-white'
            : 'text-white/50 hover:text-white/80'
          }
        `}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active background */}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-gradient-to-r from-brand-green/15 to-brand-green/5 rounded-xl"
            initial={false}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {/* Hover background */}
        <div className={`absolute inset-0 bg-white/[0.02] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isActive ? 'hidden' : ''}`} />

        {/* Active indicator line */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-green rounded-r-full"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        <span className={`relative z-10 ${isActive ? 'text-brand-green' : ''}`}>{icon}</span>
        <span className="text-sm font-medium relative z-10">{item.label}</span>
      </motion.div>
    </Link>
  );
}

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);

  const isLoginPage = pathname === '/internal';

  const refreshData = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/internal');
        return;
      }

      setUser(authUser);

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if doesn't exist (fallback)
        setProfile({
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || null,
          role: 'intern',
        });
      }

      // Restore saved team from localStorage
      const savedTeamId = localStorage.getItem('mlv_selected_team');
      if (savedTeamId) {
        const team = TEAMS.find(t => t.id === savedTeamId);
        if (team) setSelectedTeam(team);
      }

      // Get active sprint (if sprints API exists)
      try {
        const sprintsRes = await fetch('/api/internal/sprints');
        if (sprintsRes.ok) {
          const sprintsData = await sprintsRes.json();
          const active = sprintsData.find((s: Sprint) => s.is_active) || sprintsData[0];
          setActiveSprint(active || null);
        }
      } catch {
        // Sprint API might not exist yet
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoginPage) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [isLoginPage]);

  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('mlv_selected_team', selectedTeam.id);
    }
  }, [selectedTeam]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('mlv_selected_team');
    router.push('/internal');
  };

  if (isLoginPage) {
    return children;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <PortalContext.Provider value={{ user, profile, selectedTeam, setSelectedTeam, activeSprint, teams: TEAMS, refreshData }}>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-green/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-yellow/[0.02] rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - Fixed on desktop, slide-in on mobile */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-out
            lg:translate-x-0 lg:static lg:z-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full bg-[#0d0d0d]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/[0.06]">
              <Link href="/internal/home" className="flex items-center gap-3">
                <Image
                  src="/MLV Logo (white).png"
                  alt="MLV"
                  width={90}
                  height={36}
                  className="object-contain opacity-90"
                />
              </Link>
              <p className="text-white/30 text-[10px] mt-3 tracking-[0.2em] uppercase font-medium">
                Intern Portal
              </p>
            </div>

            {/* User profile - Display authenticated user */}
            <div className="px-4 py-5 border-b border-white/[0.06]">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium mb-3 px-2">Signed in as</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-yellow/10 flex items-center justify-center text-brand-green font-semibold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Team selector */}
            <div className="px-4 py-4 border-b border-white/[0.06]">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium mb-3 px-2">Your Team</p>
              <div className="relative">
                <motion.button
                  onClick={() => setTeamMenuOpen(!teamMenuOpen)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    selectedTeam
                      ? 'bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06]'
                      : 'bg-brand-yellow/10 hover:bg-brand-yellow/15 border border-brand-yellow/20'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm ${
                    selectedTeam
                      ? 'bg-gradient-to-br from-brand-yellow/20 to-brand-green/10 text-brand-yellow'
                      : 'bg-brand-yellow/20 text-brand-yellow'
                  }`}>
                    {Icons.team}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${selectedTeam ? 'text-white' : 'text-brand-yellow'}`}>
                      {selectedTeam?.name || 'Select your team'}
                    </p>
                    {!selectedTeam && (
                      <p className="text-brand-yellow/60 text-xs">Click to choose</p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: teamMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40"
                  >
                    {Icons.chevronDown}
                  </motion.div>
                </motion.button>

                {/* Team dropdown */}
                <AnimatePresence>
                  {teamMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-auto bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl z-50"
                    >
                      {TEAMS.map(team => (
                        <motion.button
                          key={team.id}
                          onClick={() => {
                            setSelectedTeam(team);
                            setTeamMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                            ${selectedTeam?.id === team.id
                              ? 'bg-brand-yellow/10 text-brand-yellow'
                              : 'text-white/80 hover:bg-white/[0.04]'
                            }
                          `}
                          whileHover={{ x: 2 }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                            selectedTeam?.id === team.id
                              ? 'bg-brand-yellow/20 text-brand-yellow'
                              : 'bg-white/[0.06] text-white/60'
                          }`}>
                            {team.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{team.name}</p>
                          </div>
                          {selectedTeam?.id === team.id && (
                            <span className="text-brand-yellow">{Icons.check}</span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sprint indicator */}
            {activeSprint && (
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  Active Sprint
                </div>
                <p className="text-white/80 text-sm font-medium">{activeSprint.name}</p>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}

              {/* Admin section */}
              {profile?.role === 'admin' && (
                <div className="pt-4 mt-4">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-brand-yellow/20 to-transparent" />
                    <span className="text-[10px] uppercase tracking-widest text-brand-yellow/50 flex items-center gap-1">
                      {Icons.sparkles}
                      Admin
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-brand-yellow/20 to-transparent" />
                  </div>
                  {adminItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={pathname.startsWith(item.href)}
                      onClick={() => setSidebarOpen(false)}
                    />
                  ))}
                </div>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/[0.06]">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white/40 hover:text-red-400 text-sm rounded-xl hover:bg-red-500/10 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {Icons.logout}
                <span>Sign out</span>
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen relative z-10 flex flex-col">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 py-4">
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/[0.04] transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {Icons.menu}
              </motion.button>

              <Image
                src="/MLV Logo (white).png"
                alt="MLV"
                width={70}
                height={28}
                className="object-contain opacity-80"
              />

              {profile ? (
                profile.avatar_url ? (
                  <button onClick={() => setSidebarOpen(true)}>
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-yellow/10 flex items-center justify-center text-brand-green text-sm font-semibold"
                  >
                    {profile.full_name.charAt(0).toUpperCase()}
                  </button>
                )
              ) : (
                <div className="w-9 h-9" />
              )}
            </div>
          </header>

          {/* Page content */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
          <div className="bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
            <div className="flex items-center justify-around py-2">
              {navItems.slice(0, 5).map((item) => {
                const isActive = pathname === item.href;
                const icon = Icons[item.icon as keyof typeof Icons];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center gap-1 px-4 py-2"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-white/40'}`}
                    >
                      {icon}
                    </motion.div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-brand-green' : 'text-white/40'}`}>
                      {item.label.split(' ')[0]}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="mobileNavIndicator"
                        className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-brand-green"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Spacer for mobile bottom nav */}
        <div className="h-20 lg:hidden" />
      </div>
    </PortalContext.Provider>
  );
}
