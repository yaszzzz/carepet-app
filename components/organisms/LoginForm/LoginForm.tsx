'use client';

import { useState } from 'react';
import { signInUser, socialSignIn } from '@/lib/actions/auth';

import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { SocialAuthButton } from '@/components/molecules/SocialAuthButton/SocialAuthButton';
import { Mail, Lock, Chrome, Facebook } from 'lucide-react';
import Link from 'next/link';

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signInUser(email, password);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err: unknown) {
            // NextAuth throws redirect error on success - re-throw it
            if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
                throw err;
            }
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail size={18} />}
                    required
                    disabled={isLoading}
                />
                <div className="space-y-1">
                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock size={18} />}
                        required
                        disabled={isLoading}
                    />
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm font-medium text-[#658C58] hover:text-[#557A47]">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
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
                    onClick={() => socialSignIn('google')}
                    disabled={isLoading}
                />
                <SocialAuthButton
                    icon={<Facebook size={18} />}
                    label="Facebook"
                    onClick={() => socialSignIn('facebook')}
                    disabled={isLoading}
                />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-[#658C58] hover:text-[#557A47]">
                    Sign up
                </Link>
            </p>
        </form>
    );
};
