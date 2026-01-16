'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Intern {
  id: number;
  name: string;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
  role: string;
}

interface Sprint {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

interface PortalContextType {
  currentUser: Intern | null;
  setCurrentUser: (user: Intern | null) => void;
  activeSprint: Sprint | null;
  interns: Intern[];
  sprints: Sprint[];
  refreshData: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  activeSprint: null,
  interns: [],
  sprints: [],
  refreshData: async () => {},
});

export const usePortal = () => useContext(PortalContext);

const navItems = [
  { href: '/internal/home', icon: 'home', label: 'Home' },
  { href: '/internal/me', icon: 'user', label: 'My Progress' },
  { href: '/internal/submit', icon: 'edit', label: 'Submit' },
  { href: '/internal/board', icon: 'board', label: 'Board' },
  { href: '/internal/team', icon: 'team', label: 'Team' },
  { href: '/internal/one-on-one', icon: 'calendar', label: '1:1 Prep' },
];

const adminItems = [
  { href: '/internal/admin', icon: 'settings', label: 'Admin' },
];

function NavIcon({ icon, className = '' }: { icon: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    board: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    team: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  };

  return icons[icon] || null;
}

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Intern | null>(null);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  // Don't apply layout to login page
  const isLoginPage = pathname === '/internal';

  const refreshData = async () => {
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

      // Set active sprint
      const active = sprintsData.find((s: Sprint) => s.is_active) || sprintsData[0];
      setActiveSprint(active || null);

      // Try to get saved user from localStorage
      const savedUserId = localStorage.getItem('mlv_current_user_id');
      if (savedUserId) {
        const user = internsData.find((i: Intern) => i.id === parseInt(savedUserId));
        if (user) setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to load data');
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

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mlv_current_user_id', currentUser.id.toString());
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await fetch('/api/internal/auth', { method: 'DELETE' });
    localStorage.removeItem('mlv_current_user_id');
    router.push('/internal');
  };

  // Login page - no layout
  if (isLoginPage) {
    return children;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-pure flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
          <p className="text-text-muted">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <PortalContext.Provider value={{ currentUser, setCurrentUser, activeSprint, interns, sprints, refreshData }}>
      <div className="min-h-screen bg-dark-pure flex">
        {/* Background effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-dark-pure via-dark-lighter to-dark-pure opacity-50 pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(106,198,112,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-dark-pure/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-dark-card/95 backdrop-blur-sm border-r border-brand-green/20
            transform transition-transform duration-200 ease-in-out
            lg:translate-x-0 lg:static lg:z-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-brand-green/20">
              <Link href="/internal/home" className="flex items-center gap-3">
                <Image
                  src="/MLV Logo (white).png"
                  alt="MLV Logo"
                  width={80}
                  height={32}
                  className="object-contain"
                />
                <span className="text-text-muted text-sm">Intern Portal</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-brand-green/20 text-brand-green'
                        : 'text-text-muted hover:text-text-light hover:bg-dark-lighter'
                      }
                    `}
                  >
                    <NavIcon icon={item.icon} className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Admin section */}
              {currentUser?.role === 'admin' && (
                <>
                  <div className="pt-4 mt-4 border-t border-brand-green/10">
                    {adminItems.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-brand-yellow/20 text-brand-yellow'
                              : 'text-text-muted hover:text-text-light hover:bg-dark-lighter'
                            }
                          `}
                        >
                          <NavIcon icon={item.icon} className="w-5 h-5" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-brand-green/20">
              {/* User selector */}
              <div className="mb-3">
                <select
                  value={currentUser?.id || ''}
                  onChange={(e) => {
                    const user = interns.find(i => i.id === parseInt(e.target.value));
                    setCurrentUser(user || null);
                  }}
                  className="w-full px-3 py-2 bg-dark-pure/50 border border-brand-green/30 rounded-lg
                           text-light-DEFAULT text-sm
                           focus:outline-none focus:border-brand-green"
                >
                  <option value="">Select yourself</option>
                  {interns.map(intern => (
                    <option key={intern.id} value={intern.id}>
                      {intern.name} {intern.role === 'admin' ? '(Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {currentUser && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-light text-sm font-medium truncate">{currentUser.name}</p>
                    {currentUser.location && (
                      <p className="text-text-muted text-xs truncate">{currentUser.location}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2
                         text-text-muted hover:text-accent-coral text-sm
                         rounded-lg hover:bg-dark-lighter transition-colors"
              >
                <NavIcon icon="logout" className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen relative z-10">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-dark-card/90 backdrop-blur-sm border-b border-brand-green/20">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-text-muted hover:text-text-light rounded-lg hover:bg-dark-lighter"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Image
                src="/MLV Logo (white).png"
                alt="MLV Logo"
                width={60}
                height={24}
                className="object-contain"
              />

              {currentUser && (
                <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm font-medium">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </header>

          {/* Page content */}
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-dark-card/90 backdrop-blur-sm border-t border-brand-green/20">
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'text-brand-green' : 'text-text-muted'}
                  `}
                >
                  <NavIcon icon={item.icon} className="w-5 h-5" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacer for mobile bottom nav */}
        <div className="h-20 lg:hidden" />
      </div>
    </PortalContext.Provider>
  );
}
