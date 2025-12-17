import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '@/components/molecules/AuthHeader/AuthHeader';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <AuthHeader
                title="Lupa Password?"
                subtitle="Masukkan email Anda untuk mereset password"
            />
            <form className="space-y-6">
                <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    leftIcon={<Mail size={18} />}
                    required
                />

                <Button type="submit" variant="primary" className="w-full py-3">
                    Kirim Link Reset
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Kembali ke{' '}
                    <Link href="/login" className="font-medium text-[#658C58] hover:text-[#557A47]">
                        Halaman Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
