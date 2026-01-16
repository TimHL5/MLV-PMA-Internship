'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function InternalLoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/internal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        router.push('/internal/home');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid access code');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-pure flex flex-col items-center justify-center p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-pure via-dark-lighter to-dark-pure opacity-50" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(106,198,112,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(106,198,112,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/MLV Logo (white).png"
            alt="MLV Logo"
            width={120}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Login Card */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-brand-green/20 rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-light-DEFAULT mb-2">
              Intern Portal
            </h1>
            <p className="text-text-muted text-sm">
              Enter your access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="code" 
                className="block text-sm font-medium text-text-light mb-2"
              >
                Access Code
              </label>
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="w-full px-4 py-3 bg-dark-pure/50 border border-brand-green/30 rounded-xl 
                         text-light-DEFAULT placeholder-text-muted
                         focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/50
                         transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-accent-coral/10 border border-accent-coral/30 rounded-lg">
                <p className="text-accent-coral text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full py-3 px-4 bg-brand-green hover:bg-primary-dark 
                       text-dark-pure font-semibold rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 transform hover:scale-[1.02]
                       shadow-glow-green hover:shadow-glow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
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
                  Verifying...
                </span>
              ) : (
                'Enter Portal'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-6">
          MLV PM Intern Tracker • 2026
        </p>
      </div>
    </div>
  );
}
