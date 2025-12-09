'use client';

import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { SocialAuthButton } from '@/components/molecules/SocialAuthButton/SocialAuthButton';
import { User, Mail, Lock, Chrome, Facebook } from 'lucide-react';
import Link from 'next/link';

export const RegisterForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Register submitted');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    leftIcon={<User size={18} />}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail size={18} />}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    required
                />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3">
                Create Account
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SocialAuthButton
                    icon={<Chrome size={18} />}
                    label="Google"
                    onClick={() => console.log('Google signup')}
                />
                <SocialAuthButton
                    icon={<Facebook size={18} />}
                    label="Facebook"
                    onClick={() => console.log('Facebook signup')}
                />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[#658C58] hover:text-[#557A47]">
                    Sign in
                </Link>
            </p>
        </form>
    );
};
