import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { redirect } from 'next/navigation';
import { AdminBookingCard, AdminBookingCardProps } from '@/components/molecules/AdminBookingCard';
import { SearchInput } from '@/components/atoms/SearchInput/SearchInput';
import { Suspense } from 'react';

export default async function AdminBoardingPage(props: {
    searchParams: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const query = searchParams?.query || '';

    const bookings = await prisma.pemesanan.findMany({
        where: {
            OR: [
                { hewan: { nama_hewan: { contains: query, mode: 'insensitive' } } },
                { hewan: { pengguna: { nama_pengguna: { contains: query, mode: 'insensitive' } } } },
                { id_pemesanan: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            hewan: {
                select: { // Or include? Using select to pick specific fields
                    nama_hewan: true,
                    jenis: true,
                    pengguna: { // Nested relation
                        select: {
                            nama_pengguna: true,
                            no_hp: true
                        }
                    }
                }
            },
            layanan: {
                select: {
                    nama_layanan: true
                }
            }
        },
        orderBy: {
            tgl_masuk: 'desc'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Penitipan</h1>
                    <p className="text-gray-400 mt-1">Pantau dan kelola status penitipan hewan.</p>
                </div>
                <Suspense fallback={<div className="w-64 h-10 bg-gray-700 rounded-lg animate-pulse" />}>
                    <SearchInput placeholder="Cari ID, hewan, atau pemilik..." />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookings.map((booking: AdminBookingCardProps['booking']) => (
                    <AdminBookingCard
                        key={booking.id_pemesanan}
                        booking={booking}
                    />
                ))}
            </div>
        </AdminDashboardLayout>
    );
}
