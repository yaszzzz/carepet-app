import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutContent } from '@/components/LayoutContent';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Care Pet - Perawatan Hewan Profesional',
  description: 'Layanan perawatan hewan peliharaan terpercaya',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-900`}>
        <SessionProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}