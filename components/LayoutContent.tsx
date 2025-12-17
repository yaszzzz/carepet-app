'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { Footer } from '@/components/organisms/Footer/Footer';
import { ReactNode } from 'react';

export const LayoutContent = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    // Pages specifically needing the Navbar hidden (Login/Register/Dashboard/Admin)
    const hideNavbar =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname === '/login' ||
        pathname === '/register';

    // Footer only on exact home page
    const showFooter = pathname === '/';

    return (
        <>
            {!hideNavbar && <Navbar />}
            <main className={!hideNavbar ? "min-h-screen pt-16" : ""}>
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
};
