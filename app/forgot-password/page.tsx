'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '@/components/molecules/AuthHeader/AuthHeader';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/actions/auth';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSuccessMessage(result.message || 'Link reset password telah dikirim.');
            } else {
                setErrorMessage(result.error || 'Terjadi kesalahan.');
            }
        } catch (error) {
            setErrorMessage('Terjadi kesalahan yang tidak terduga.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthHeader
                title="Lupa Password?"
                subtitle="Masukkan email Anda untuk mereset password"
            />

            {successMessage ? (
                <div className="text-center space-y-4 py-8">
                    <div className="flex justify-center">
                        <div className="p-4 bg-green-100 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Email Terkirim!</h3>
                    <p className="text-gray-600">{successMessage}</p>
                    <p className="text-sm text-gray-500 mt-4">
                        (Cek console log server untuk melihat link reset karena ini adalah environment development)
                    </p>
                    <div className="pt-4">
                        <Link href="/login" className="text-[#658C58] font-medium hover:underline">
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                        <div className="p-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-lg">
                            <AlertCircle size={18} />
                            {errorMessage}
                        </div>
                    )}

                    <Input
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        leftIcon={<Mail size={18} />}
                        required
                        disabled={isLoading}
                    />

                    <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
                        Kirim Link Reset
                    </Button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Kembali ke{' '}
                        <Link href="/login" className="font-medium text-[#658C58] hover:text-[#557A47]">
                            Halaman Login
                        </Link>
                    </p>
                </form>
            )}
        </AuthLayout>
    );
}
