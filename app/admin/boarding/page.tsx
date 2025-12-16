import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { Home, Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function AdminBoardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const bookings = await prisma.pemesanan.findMany({
        include: {
            hewan: {
                include: {
                    pengguna: true
                }
            },
            layanan: true
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
                    <p className="text-gray-400 mt-1">Pantau dan kelola jadwal penitipan hewan.</p>
                </div>
                {/* Search UI */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari ID atau nama pemilik..."
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Kanban-like status columns or just a list? A list is simpler for V1 */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-gray-200 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4">ID Pemesanan</th>
                                <th className="px-6 py-4">Hewan & Pemilik</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">Jadwal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Tidak ada data penitipan.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking.id_pemesanan} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                                            #{booking.id_pemesanan}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{booking.hewan.nama_hewan}</p>
                                            <p className="text-xs text-gray-500">{booking.hewan.pengguna.nama_pengguna}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                                {booking.layanan.nama_layanan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-green-400">IN:</span> {format(booking.tgl_masuk, 'dd MMM', { locale: id })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="text-red-400">OUT:</span> {format(booking.tgl_keluar, 'dd MMM', { locale: id })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase border ${booking.status === 'Selesai' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    booking.status === 'Proses' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        booking.status === 'Dibatalkan' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button title="Lihat Detail" className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                {booking.status === 'Menunggu' && (
                                                    <>
                                                        <button title="Terima" className="p-1.5 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors">
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button title="Tolak" className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
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
