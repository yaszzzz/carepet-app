import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminReportsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    // Example aggregations
    const totalRevenue = await prisma.pembayaran.aggregate({
        _sum: {
            jumlah_bayar: true
        }
    });

    const totalBookings = await prisma.pemesanan.count();
    const completedBookings = await prisma.pemesanan.count({
        where: {
            status: 'Selesai'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Laporan & Statistik</h1>
                <p className="text-gray-400 mt-1">Ringkasan kinerja dan analisis data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 shadow-lg border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        <span className="text-indigo-200 text-sm font-medium">Total Pendapatan</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        Rp {(totalRevenue._sum.jumlah_bayar || 0).toLocaleString('id-ID')}
                    </h3>
                    <p className="text-indigo-200 text-sm">Akumulasi semua transaksi</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-6 shadow-lg border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <span className="text-emerald-200 text-sm font-medium">Total Pemesanan</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        {totalBookings}
                    </h3>
                    <p className="text-emerald-200 text-sm">{completedBookings} Selesai</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <BarChart3 className="text-white" size={24} />
                        </div>
                        <span className="text-purple-200 text-sm font-medium">Statistik Bulanan</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        +12%
                    </h3>
                    <p className="text-purple-200 text-sm">Peningkatan dari bulan lalu</p>
                </div>
            </div>

            {/* Placeholder for Chart */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Grafik statistik akan ditampilkan di sini.</p>
                    <p className="text-sm">(Integrasi chart library diperlukan)</p>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
