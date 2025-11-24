import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://internships.mlvignite.com'),
  title: 'MLV Product Management Associate Program | 2026 Cohort',
  description: 'Don\'t just learn startups. Build one. Join MLV\'s Product Management Associate internship program and launch your own venture.',
  keywords: ['internship', 'product management', 'startup', 'MLV', 'entrepreneurship', '2026'],
  authors: [{ name: 'MLV' }],
  openGraph: {
    title: 'MLV Product Management Associate Program | 2026 Cohort',
    description: 'Don\'t just learn startups. Build one. Join MLV\'s Product Management Associate internship program.',
    url: 'https://internships.mlvignite.com',
    siteName: 'MLV Internships',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MLV Product Management Associate Program | 2026 Cohort',
    description: 'Don\'t just learn startups. Build one.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
