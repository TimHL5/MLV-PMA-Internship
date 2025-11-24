import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Apply - MLV Product Management Associate Program 2026',
  description: 'Apply now to join MLV\'s 8-month intensive Product Management Associate program. Build real startups across Hong Kong, Vietnam, and Singapore.',
  openGraph: {
    title: 'Apply - MLV PMA Program 2026',
    description: 'Apply now to join MLV\'s Product Management Associate internship program.',
    type: 'website',
  },
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-lg border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            {/* Logo */}
            <Link
              href="https://mlvignite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[100px] sm:w-[120px] h-[32px] sm:h-[40px]"
            >
              <Image
                src="/logo-white.png"
                alt="MLV"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* Placeholder for symmetry */}
            <div className="w-20 sm:w-32" />
          </div>
        </div>
      </nav>

      {/* Tally Form Embed - Full Page */}
      <main className="flex-1 pt-16">
        <iframe
          data-tally-src="https://tally.so/r/gDDENl?transparentBackground=1"
          loading="lazy"
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="MLV PMA Application"
          className="absolute top-16 left-0 right-0 bottom-0"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            border: 0,
          }}
        />
      </main>

      {/* Tally Script */}
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          if (typeof Tally !== 'undefined') {
            // @ts-ignore
            Tally.loadEmbeds()
          }
        }}
      />
    </div>
  )
}
