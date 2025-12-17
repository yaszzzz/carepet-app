import { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex bg-gradient-to-r from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5">
            {/* Left Side - Hero/Decorative (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12">
                <div className="relative w-full max-w-lg aspect-square">
                    {/* Main Image Container */}
                    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#BBC863] via-[#658C58] to-[#31694E] flex items-center justify-center">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#F0E491]"></div>
                                <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#F0E491]"></div>
                            </div>

                            {/* Hero Content */}
                            <div className="relative text-center text-white p-8">
                                <div className="mb-6">
                                    <Heart className="h-24 w-24 mx-auto text-white/90" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Rumah Kedua</h3>
                                <p className="text-white/90 text-lg">Untuk Hewan Kesayangan Anda</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card 1 */}
                    <div className="absolute top-[20%] -left-8 bg-white p-4 rounded-2xl shadow-xl max-w-xs animate-bounce-slow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-[#F0E491]/20">
                                <Shield className="h-8 w-8 text-[#658C58]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Terpercaya</h3>
                                <p className="text-sm text-gray-600">100% aman</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card 2 */}
                    <div className="absolute bottom-[20%] -right-8 bg-white p-4 rounded-2xl shadow-xl max-w-xs animate-bounce-slow delay-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-[#31694E]/10">
                                <svg className="h-8 w-8 text-[#31694E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Bersertifikat</h3>
                                <p className="text-sm text-gray-600">Profesional</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center">
                        <Link href="/" className="flex items-center gap-2 group mb-8">
                            <div className="bg-[#658C58] p-2 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                                <PawPrint size={32} />
                            </div>
                            <span className="text-2xl font-bold text-gray-100">Care Pet</span>
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        {children}
                    </div>


                </div>
            </div>
        </div>
    );
};
