'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/actions/auth';

import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { SocialAuthButton } from '@/components/molecules/SocialAuthButton/SocialAuthButton';
import { User, Mail, Lock, Chrome, Facebook, Phone, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            nama: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            no_hp: formData.get('phone') as string,
            alamat: formData.get('address') as string,
        };

        try {
            const result = await registerUser(data);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err: unknown) {
            console.error('Registration error:', err);
            if (err instanceof Error) {
                // Check if it's a serialization/network error
                if (err.message.includes('DOCTYPE') || err.message.includes('Unexpected token')) {
                    setError('Koneksi ke server bermasalah. Silakan coba lagi.');
                } else {
                    setError(err.message || 'Terjadi kesalahan saat mendaftar');
                }
            } else {
                setError('Terjadi kesalahan saat mendaftar');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Registrasi Berhasil!</h3>
                <p className="text-gray-600">Akun Anda telah dibuat. Mengalihkan ke halaman login...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                <Input
                    name="name"
                    label="Nama Lengkap"
                    type="text"
                    placeholder="John Doe"
                    leftIcon={<User size={18} />}
                    required
                    disabled={isLoading}
                />
                <Input
                    name="email"
                    label="Alamat Email"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail size={18} />}
                    required
                    disabled={isLoading}
                />
                <Input
                    name="phone"
                    label="Nomor HP"
                    type="tel"
                    placeholder="08123456789"
                    leftIcon={<Phone size={18} />}
                    required
                    disabled={isLoading}
                />
                <Input
                    name="address"
                    label="Alamat"
                    type="text"
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    leftIcon={<MapPin size={18} />}
                    required
                    disabled={isLoading}
                />
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    required
                    disabled={isLoading}
                />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
                Buat Akun
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Atau daftar dengan</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SocialAuthButton
                    icon={<Chrome size={18} />}
                    label="Google"
                    onClick={() => console.log('Google signup')}
                    disabled={isLoading}
                />
                <SocialAuthButton
                    icon={<Facebook size={18} />}
                    label="Facebook"
                    onClick={() => console.log('Facebook signup')}
                    disabled={isLoading}
                />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-medium text-[#658C58] hover:text-[#557A47]">
                    Masuk
                </Link>
            </p>
        </form>
    );
};

