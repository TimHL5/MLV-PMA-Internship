import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply - MLV Product Management Associate Program 2026',
  description: 'Apply now to join MLV\'s 8-month intensive Product Management Associate program. Build real startups across Hong Kong, Vietnam, and Singapore.',
  openGraph: {
    title: 'Apply - MLV PMA Program 2026',
    description: 'Apply now to join MLV\'s Product Management Associate internship program.',
    type: 'website',
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
