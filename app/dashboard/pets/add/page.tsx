import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { PetForm } from '@/components/organisms/PetForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddPetPage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <Link
                    href="/dashboard/pets"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Tambah Hewan Baru</h1>
                <p className="text-gray-100 mt-1">Lengkapi data hewan peliharaan Anda.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Data Hewan</CardTitle>
                        <CardDescription>Informasi ini akan digunakan untuk layanan penitipan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PetForm />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
