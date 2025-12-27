import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { CreditCard, Search, CheckCircle, XCircle, Filter } from 'lucide-react';
import { SearchInput } from '@/components/atoms/SearchInput/SearchInput';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AdminPaymentsTable from '@/components/organisms/AdminPaymentsTable';
import { Suspense } from 'react';

export default async function AdminPaymentsPage(props: {
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

    const payments = await prisma.pembayaran.findMany({
        where: {
            OR: [
                { id_pembayaran: { contains: query, mode: 'insensitive' } },
                { pemesanan: { hewan: { pengguna: { nama_pengguna: { contains: query, mode: 'insensitive' } } } } }
            ]
        },
        include: {
            pemesanan: {
                include: {
                    hewan: {
                        include: {
                            pengguna: true
                        }
                    },
                    layanan: true
                }
            }
        },
        orderBy: {
            tanggal_bayar: 'desc'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Pembayaran</h1>
                    <p className="text-gray-400 mt-1">Verifikasi dan pantau transaksi pembayaran.</p>
                </div>
                <div className="flex gap-2">
                    <Suspense fallback={<div className="w-64 h-10 bg-gray-700 rounded-lg animate-pulse" />}>
                        <SearchInput placeholder="Cari ID atau Nama User..." />
                    </Suspense>
                </div>
            </div>

            <AdminPaymentsTable payments={payments} />
        </AdminDashboardLayout>
    );
}
