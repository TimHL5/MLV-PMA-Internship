import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MLV Product Management Associate Program | 2026 Cohort',
  description: 'Don\'t just learn startups. Build one. Join MLV\'s Product Management Associate internship program and launch your own venture.',
  keywords: ['internship', 'product management', 'startup', 'MLV', 'entrepreneurship', '2026'],
  authors: [{ name: 'MLV' }],
  openGraph: {
    title: 'MLV Product Management Associate Program | 2026 Cohort',
    description: 'Don\'t just learn startups. Build one. Join MLV\'s Product Management Associate internship program.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MLV Product Management Associate Program | 2026 Cohort',
    description: 'Don\'t just learn startups. Build one.',
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
