'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page redirects to the new login page
// The old /internal routes are deprecated in favor of /mlv/[team] routes
export default function InternalLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-pure flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
    </div>
  );
}
