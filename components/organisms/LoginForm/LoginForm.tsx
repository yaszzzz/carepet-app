'use client';

import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { SocialAuthButton } from '@/components/molecules/SocialAuthButton/SocialAuthButton';
import { Mail, Lock, Chrome, Facebook } from 'lucide-react';
import Link from 'next/link';

export const LoginForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login submitted');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail size={18} />}
                    required
                />
                <div className="space-y-1">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock size={18} />}
                        required
                    />
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm font-medium text-[#658C58] hover:text-[#557A47]">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={false}>
                Sign in
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SocialAuthButton
                    icon={<Chrome size={18} />}
                    label="Google"
                    onClick={() => console.log('Google login')}
                />
                <SocialAuthButton
                    icon={<Facebook size={18} />}
                    label="Facebook"
                    onClick={() => console.log('Facebook login')}
                />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-[#658C58] hover:text-[#557A47]">
                    Sign up
                </Link>
            </p>
        </form>
    );
};
