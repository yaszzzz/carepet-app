import { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-r from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#658C58] p-2 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                        <PawPrint size={32} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">Care Pet</span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {children}
            </div>

            <p className="mt-8 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Care Pet. All rights reserved.
            </p>
        </div>
    );
};
