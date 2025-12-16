import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Footer } from '@/components/organisms/Footer/Footer';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Care Pet - Perawatan Hewan Profesional',
  description: 'Layanan perawatan hewan peliharaan terpercaya',
};

import { SessionProvider } from 'next-auth/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Pages that should not have the main navbar/footer
  const hideNavbar = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-900`}>
        <SessionProvider>
          {!hideNavbar && <Navbar />}
          <main className={!hideNavbar ? "min-h-screen pt-16" : ""}>{children}</main>
          {!hideNavbar && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
}