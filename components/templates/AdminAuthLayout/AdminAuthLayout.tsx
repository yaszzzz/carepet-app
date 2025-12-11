import { ReactNode } from 'react';
import { PawPrint, Shield, Lock } from 'lucide-react';
import Link from 'next/link';

interface AdminAuthLayoutProps {
    children: ReactNode;
}

export const AdminAuthLayout = ({ children }: AdminAuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Left Side - Admin Hero (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12">
                <div className="relative w-full max-w-lg aspect-square">
                    {/* Main Container */}
                    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0">
                                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
                                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
                            </div>

                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                ></div>
                            </div>

                            {/* Hero Content */}
                            <div className="relative text-center text-white p-8 z-10">
                                <div className="mb-8">
                                    <div className="inline-flex p-6 rounded-3xl bg-white/10 backdrop-blur-sm">
                                        <Shield className="h-20 w-20 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Admin Dashboard</h3>
                                <p className="text-white/80 text-lg mb-8">Kelola CarePet dengan mudah dan aman</p>

                                {/* Feature Pills */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                        <Lock className="h-4 w-4" />
                                        <span className="text-sm">Secure Access</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                        <PawPrint className="h-4 w-4" />
                                        <span className="text-sm">Pet Management</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card - Security */}
                    <div className="absolute top-[15%] -left-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-700/50 animate-bounce-slow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/20">
                                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Secure</h4>
                                <p className="text-xs text-gray-400">256-bit SSL</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card - Stats */}
                    <div className="absolute bottom-[15%] -right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-700/50 animate-bounce-slow delay-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20">
                                <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Analytics</h4>
                                <p className="text-xs text-gray-400">Real-time data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="bg-indigo-600 p-2 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                                <PawPrint size={28} />
                            </div>
                            <span className="text-xl font-bold text-white">CarePet</span>
                        </Link>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            ADMIN PORTAL
                        </span>
                    </div>

                    {/* Form Container */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-500">
                        © 2024 CarePet. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};
