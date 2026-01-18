'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import { TeamProvider, useAuth, useTeam } from '@/components/providers';
import {
  Home,
  User,
  Users,
  LayoutGrid,
  MessageSquare,
  Coffee,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: typeof Home;
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { user, signOut, loading: authLoading } = useAuth();
  const { team, organization, currentSprint, loading: teamLoading } = useTeam();
  const pathname = usePathname();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const baseUrl = `/${params.org}/${params.team}`;

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: baseUrl, icon: Home },
    { name: 'My Progress', href: `${baseUrl}/me`, icon: User },
    { name: 'Team', href: `${baseUrl}/team`, icon: Users },
    { name: 'Board', href: `${baseUrl}/board`, icon: LayoutGrid },
    { name: '1:1 Prep', href: `${baseUrl}/one-on-one`, icon: MessageSquare },
    { name: 'Coffee Chats', href: `${baseUrl}/coffee`, icon: Coffee },
    { name: 'Submit', href: `${baseUrl}/submit`, icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === baseUrl) {
      return pathname === baseUrl;
    }
    return pathname.startsWith(href);
  };

  if (authLoading || teamLoading) {
    return (
      <div className="min-h-screen bg-dark-pure flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-pure flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-pure/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-brand-green/20
          transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-brand-green/20">
            <Link href={baseUrl} className="flex items-center gap-2">
              <Image
                src="/MLV Logo (white).png"
                alt="MLV"
                width={80}
                height={32}
                className="object-contain"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-text-muted hover:text-text-light"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Team/Sprint info */}
          <div className="p-4 border-b border-brand-green/20">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {organization?.name || 'Organization'}
            </p>
            <p className="text-sm font-medium text-light-DEFAULT mt-1">
              {team?.name || 'Team'}
            </p>
            {currentSprint && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-brand-green/10 text-brand-green text-xs rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                {currentSprint.name}
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'bg-brand-green/10 text-brand-green'
                      : 'text-text-light hover:bg-dark-pure/50 hover:text-light-DEFAULT'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-brand-green/20">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-pure/50 transition-colors"
              >
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-green/20 flex items-center justify-center">
                    <span className="text-brand-green font-medium">
                      {user?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-light-DEFAULT truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-dark-pure border border-brand-green/20 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    href={`${baseUrl}/settings`}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-light hover:bg-dark-card transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-accent-coral hover:bg-dark-card transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-dark-card border-b border-brand-green/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-text-light hover:text-light-DEFAULT"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Image
            src="/MLV Logo (white).png"
            alt="MLV"
            width={60}
            height={24}
            className="object-contain"
          />
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center">
              <span className="text-brand-green text-sm font-medium">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { org: string; team: string };
}) {
  return (
    <TeamProvider orgSlug={params.org} teamSlug={params.team}>
      <DashboardContent>{children}</DashboardContent>
    </TeamProvider>
  );
}
