

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { CreditCard, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default async function PaymentsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Fetch Bookings instead of Payments to show "Unpaid" bills
    const bookings = await prisma.pemesanan.findMany({
        where: {
            hewan: {
                id_pengguna: session.user.id
            }
        },
        include: {
            layanan: true,
            hewan: true,
            pembayaran: true // Include payment details if any
        },
        orderBy: {
            tgl_masuk: 'desc'
        }
    });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Riwayat Pembayaran</h1>
                <p className="text-gray-100 mt-1">Daftar tagihan dan status pembayaran layanan Anda.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada tagihan</h3>
                    <p className="text-gray-500">Anda belum melakukan pemesanan layanan.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">ID Booking</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4 text-right">Total Tagihan</th>
                                    <th className="px-6 py-4 text-center">Status Pembayaran</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => {
                                    // Calculate Duration & Price dynamically
                                    const start = new Date(booking.tgl_masuk);
                                    const end = new Date(booking.tgl_keluar);
                                    const durationMs = end.getTime() - start.getTime();
                                    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) || 1;
                                    const estimatedTotal = durationDays * booking.layanan.harga;

                                    // Determine actual paid amount or estimated
                                    // If paid, use payment amount. If not, use estimated.
                                    const paidAmount = booking.pembayaran?.[0]?.jumlah_bayar;
                                    const displayAmount = paidAmount || estimatedTotal;

                                    return (
                                        <tr key={booking.id_pemesanan} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{booking.id_pemesanan}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {booking.layanan.nama_layanan}
                                                <div className="text-xs text-gray-500 font-normal mt-0.5">{booking.hewan.nama_hewan}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs">
                                                    <span>{format(booking.tgl_masuk, 'dd MMM', { locale: id })}</span>
                                                    <span className="text-gray-400">s/d</span>
                                                    <span>{format(booking.tgl_keluar, 'dd MMM yyyy', { locale: id })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-[#31694E]">
                                                Rp {displayAmount.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {booking.status === 'Lunas' || booking.status === 'Selesai' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} />
                                                        Lunas
                                                    </span>
                                                ) : booking.status === 'Menunggu Konfirmasi' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        <Clock size={12} />
                                                        Menunggu Konfirmasi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                        <AlertCircle size={12} />
                                                        Belum Dibayar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {/* If status is 'Menunggu Pembayaran' (or implicitly not paid/confirmed), show Pay button */}
                                                {(booking.status === 'Menunggu Pembayaran' || booking.status === 'Menunggu') && (
                                                    <Link
                                                        href={`/dashboard/payment/${booking.id_pemesanan}`}
                                                        className="inline-block px-4 py-1.5 bg-[#658C58] text-white text-xs font-medium rounded-lg hover:bg-[#31694E] transition-colors"
                                                    >
                                                        Bayar
                                                    </Link>
                                                )}
                                                {booking.status === 'Menunggu Konfirmasi' && (
                                                    <span className="text-xs text-gray-400">Sedang diproses</span>
                                                )}
                                                {(booking.status === 'Lunas' || booking.status === 'Selesai') && (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
