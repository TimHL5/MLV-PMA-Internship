'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    board: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    team: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    chevron: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
  };

  return icons[icon] || null;
}

// Premium loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-dark-pure flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-green to-brand-yellow blur-xl opacity-30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Spinner */}
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-brand-green/20"
            style={{ borderTopColor: '#6AC670' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        <motion.p
          className="text-text-muted/80 text-sm tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading your workspace...
        </motion.p>
      </div>
    </div>
  );
}

// Nav item component with hover effects
function NavItem({
  item,
  isActive,
  onClick
}: {
  item: typeof navItems[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="relative group block"
    >
      <motion.div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
          ${isActive
            ? 'text-brand-green'
            : 'text-text-muted hover:text-text-light'
          }
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute inset-0 bg-brand-green/10 rounded-xl border border-brand-green/20"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}

        {/* Hover background */}
        <motion.div
          className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ display: isActive ? 'none' : 'block' }}
        />

        <NavIcon icon={item.icon} className="w-5 h-5 relative z-10" />
        <span className="text-sm font-medium relative z-10">{item.label}</span>

        {/* Active dot */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-green rounded-r-full"
            layoutId="activeNavDot"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Intern | null>(null);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

      const active = sprintsData.find((s: Sprint) => s.is_active) || sprintsData[0];
      setActiveSprint(active || null);

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

  if (isLoginPage) {
    return children;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <PortalContext.Provider value={{ currentUser, setCurrentUser, activeSprint, interns, sprints, refreshData }}>
      <div className="min-h-screen bg-dark-pure flex">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(106,198,112,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-pure/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 z-50 w-72 lg:translate-x-0 lg:static lg:z-auto"
        >
          <div className="h-full bg-gradient-to-b from-dark-card/95 to-dark-pure/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
            {/* Logo area */}
            <div className="p-6 border-b border-white/5">
              <Link href="/internal/home" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Image
                    src="/MLV Logo (white).png"
                    alt="MLV Logo"
                    width={100}
                    height={40}
                    className="object-contain"
                  />
                </motion.div>
              </Link>
              <p className="text-text-muted/60 text-xs mt-2 tracking-wider uppercase">
                Intern Portal
              </p>
            </div>

            {/* Sprint indicator */}
            {activeSprint && (
              <div className="px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs text-text-muted/60 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Current Sprint
                </div>
                <p className="text-text-light font-medium">{activeSprint.name}</p>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}

              {/* Admin section */}
              {currentUser?.role === 'admin' && (
                <div className="pt-4 mt-4">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-brand-yellow/20 to-transparent" />
                    <span className="text-[10px] uppercase tracking-widest text-brand-yellow/50">Admin</span>
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

            {/* User section */}
            <div className="p-4 border-t border-white/5">
              {/* User selector dropdown */}
              <div className="relative mb-3">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green/30 to-brand-yellow/30 flex items-center justify-center text-brand-green font-semibold ring-2 ring-brand-green/20">
                    {currentUser?.name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-text-light text-sm font-medium truncate">
                      {currentUser?.name || 'Select yourself'}
                    </p>
                    {currentUser?.location && (
                      <p className="text-text-muted/60 text-xs truncate">{currentUser.location}</p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavIcon icon="chevron" className="w-4 h-4 text-text-muted" />
                  </motion.div>
                </motion.button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-auto bg-dark-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                    >
                      {interns.map(intern => (
                        <motion.button
                          key={intern.id}
                          onClick={() => {
                            setCurrentUser(intern);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors
                            ${currentUser?.id === intern.id ? 'bg-brand-green/10 text-brand-green' : 'text-text-light'}
                          `}
                          whileHover={{ x: 4 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm font-medium">
                            {intern.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{intern.name}</p>
                            {intern.role === 'admin' && (
                              <span className="text-[10px] text-brand-yellow/80 uppercase tracking-wider">Admin</span>
                            )}
                          </div>
                          {currentUser?.id === intern.id && (
                            <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logout button */}
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-text-muted/70 hover:text-accent-coral text-sm rounded-xl hover:bg-accent-coral/10 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavIcon icon="logout" className="w-4 h-4" />
                <span>Sign out</span>
              </motion.button>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen relative z-10 flex flex-col">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-dark-card/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-4 py-4">
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-text-muted hover:text-text-light rounded-xl hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              <Image
                src="/MLV Logo (white).png"
                alt="MLV Logo"
                width={80}
                height={32}
                className="object-contain"
              />

              {currentUser ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-green/30 to-brand-yellow/30 flex items-center justify-center text-brand-green text-sm font-semibold ring-2 ring-brand-green/20">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="w-9 h-9" />
              )}
            </div>
          </header>

          {/* Page content with animation */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
          <div className="bg-dark-card/90 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
            <div className="flex items-center justify-around py-2">
              {navItems.slice(0, 5).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-text-muted'}`}
                    >
                      <NavIcon icon={item.icon} className="w-5 h-5" />
                    </motion.div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-brand-green' : 'text-text-muted/70'}`}>
                      {item.label.split(' ')[0]}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="mobileNavIndicator"
                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-green"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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
