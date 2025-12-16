import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { BookingForm } from '@/components/organisms/BookingForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;

    const [service, pets] = await Promise.all([
        prisma.layanan.findUnique({
            where: { id_layanan: id }
        }),
        prisma.hewan.findMany({
            where: { id_pengguna: session.user.id }
        })
    ]);

    if (!service) {
        return (
            <DashboardLayout>
                <div className="text-center py-20 text-gray-500">
                    Layanan tidak ditemukan.
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <Link
                    href="/dashboard/services"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali ke Layanan</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Booking Layanan</h1>
                <p className="text-gray-100 mt-1">Lengkapi detail pemesanan untuk {service.nama_layanan}.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Formulir Pemesanan</CardTitle>
                        <CardDescription>Pastikan data hewan dan tanggal sudah benar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pets.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-gray-600 mb-4">Anda belum mendaftarkan hewan peliharaan.</p>
                                <Link href="/dashboard/pets/add">
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                        Tambah Hewan Terlebih Dahulu
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <BookingForm service={service} pets={pets} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
