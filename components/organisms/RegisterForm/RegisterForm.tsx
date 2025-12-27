'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, socialSignIn } from '@/lib/actions/auth';

import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { SocialAuthButton } from '@/components/molecules/SocialAuthButton/SocialAuthButton';
import { User, Mail, Lock, Chrome, Facebook, Phone, MapPin, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validation: Check if passwords match
        if (password !== confirmPassword) {
            setError('Password dan Konfirmasi Password tidak cocok');
            setIsLoading(false);
            return;
        }

        const data = {
            nama: formData.get('name') as string,
            email: formData.get('email') as string,
            password: password,
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
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="focus:outline-none hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    required
                    disabled={isLoading}
                />
                <Input
                    name="confirmPassword"
                    label="Konfirmasi Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="focus:outline-none hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    required
                    disabled={isLoading}
                />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
                Buat Akun
            </Button>



            <p className="mt-4 text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-medium text-[#658C58] hover:text-[#557A47]">
                    Masuk
                </Link>
            </p>
        </form>
    );
};
