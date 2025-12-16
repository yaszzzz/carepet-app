import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { CreditCard, Search, CheckCircle, XCircle, Filter } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function AdminPaymentsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const payments = await prisma.pembayaran.findMany({
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
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari ID Pembayaran..."
                            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-gray-200 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4">ID Transaksi</th>
                                <th className="px-6 py-4">Pengguna</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Metode</th>
                                <th className="px-6 py-4 text-right">Jumlah</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CreditCard size={32} className="opacity-50" />
                                            <p>Belum ada data pembayaran.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id_pembayaran} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                                            #{payment.id_pembayaran}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{payment.pemesanan.hewan.pengguna.nama_pengguna}</p>
                                            <p className="text-xs text-gray-500">{payment.pemesanan.hewan.pengguna.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.pemesanan.layanan.nama_layanan}
                                        </td>
                                        <td className="px-6 py-4">
                                            {format(payment.tanggal_bayar, 'dd MMM yyyy', { locale: id })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-700 px-2 py-1 rounded text-xs uppercase font-medium">
                                                {payment.metode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                            Rp {payment.jumlah_bayar.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* Since we don't have a status field in Pembayaran, we assume listed ones are confirmed or just View */}
                                            <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium hover:underline">
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
