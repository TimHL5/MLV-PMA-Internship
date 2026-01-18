import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://internships.mlvignite.com'),
  title: 'MLV Product Management Associate Program 2026 | For US College Students from Asia',
  description: 'Join MLV\'s 8-month intensive program for US college freshmen/sophomores who went to high school in Hong Kong, HCMC, Hanoi, or Singapore. Shadow a $50K+ startup, then launch your own initiative.',

  openGraph: {
    title: 'MLV Product Management Associate Program 2026',
    description: 'For US college students who went to high school in Hong Kong, Ho Chi Minh City, Hanoi, or Singapore. Shadow a $50K+ startup, then launch your own revenue-generating initiative.',
    url: 'https://internships.mlvignite.com',
    siteName: 'MLV PMA Program',
    images: [
      {
        url: '/seo.jpeg',
        width: 1200,
        height: 630,
        alt: 'MLV Product Management Associate Program 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'MLV Product Management Associate Program 2026',
    description: 'For US college students who went to high school in Hong Kong, HCMC, Hanoi, or Singapore.',
    images: ['/seo.jpeg'],
  },

  keywords: [
    'MLV internship',
    'product management internship',
    'startup internship',
    'Asia entrepreneurship',
    'college internship',
    'Hong Kong',
    'Ho Chi Minh City',
    'Hanoi',
    'Singapore',
    'US college students',
    'Asian students',
    'entrepreneurship program',
  ],

  authors: [{ name: 'MLV - Makers Lab Ventures' }],
  creator: 'MLV',
  publisher: 'MLV',

  icons: {
    icon: [
      { url: '/favicon_mlv/favicon.ico' },
      { url: '/favicon_mlv/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_mlv/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_mlv/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon_mlv/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon_mlv/android-chrome-512x512.png',
      },
    ],
  },

  manifest: '/favicon_mlv/site.webmanifest',

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
