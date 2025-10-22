import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'SecretForge - Privacy-First Deployment Platform',
  description: 'Deploy encrypted AI services on Secret Network with SecretVM',
  keywords: ['Secret Network', 'SecretVM', 'Privacy', 'AI', 'Deployment', 'TEE'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
