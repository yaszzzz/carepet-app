'use client';

import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { CreditCard, Search, CheckCircle, XCircle, Filter, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SearchInput } from '@/components/atoms/SearchInput/SearchInput';
import { useState } from 'react';
import { AdminPaymentDetailModal } from '@/components/organisms/AdminPaymentDetailModal/AdminPaymentDetailModal';

// Need to pass data from Server Component to Client Component to handle Modal state
// Or keep separate table component? Keeping table component is better.

export default function AdminPaymentsTable({ payments }: { payments: any[] }) {
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    return (
        <>
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
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Jumlah</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
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
                                            {format(new Date(payment.tanggal_bayar), 'dd MMM yyyy', { locale: id })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-700 px-2 py-1 rounded text-xs uppercase font-medium">
                                                {payment.metode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.pemesanan.status === 'Lunas' || payment.pemesanan.status === 'Selesai' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle size={12} />
                                                    Lunas
                                                </span>
                                            ) : payment.pemesanan.status === 'Menunggu Konfirmasi' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <p>Menunggu Konfirmasi</p>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                    {payment.pemesanan.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                            Rp {payment.jumlah_bayar.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedPayment(payment)}
                                                className="text-indigo-400 hover:text-indigo-300 text-xs font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                                            >
                                                <Eye size={14} />
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPayment && (
                <AdminPaymentDetailModal
                    payment={selectedPayment}
                    isOpen={!!selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </>
    );
}
