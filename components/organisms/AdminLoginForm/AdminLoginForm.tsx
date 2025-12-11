'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export const AdminLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Admin login submitted');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Admin
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="admin@carepet.com"
                            required
                            className="w-full px-4 py-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 pl-10 pr-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-gray-800"
                    />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <Link
                    href="/admin/forgot-password"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Signing in...</span>
                    </>
                ) : (
                    <span>Sign in to Dashboard</span>
                )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock size={12} />
                <span>Protected by 256-bit SSL encryption</span>
            </div>

            {/* Back to User Login */}
            <p className="text-center text-sm text-gray-400">
                Bukan admin?{' '}
                <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Login sebagai user
                </Link>
            </p>
        </form>
    );
};
