import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { CreditCard, Calendar, CheckCircle2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function PaymentsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const payments = await prisma.pembayaran.findMany({
        where: {
            pemesanan: {
                hewan: {
                    id_pengguna: session.user.id
                }
            }
        },
        include: {
            pemesanan: {
                include: {
                    layanan: true
                }
            }
        },
        orderBy: {
            tanggal_bayar: 'desc'
        }
    });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Riwayat Pembayaran</h1>
                <p className="text-gray-500 mt-1">Daftar transaksi pembayaran layanan Anda.</p>
            </div>

            {payments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada transaksi</h3>
                    <p className="text-gray-500">Anda belum melakukan pembayaran apapun.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">ID Pembayaran</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Metode</th>
                                    <th className="px-6 py-4 text-right">Jumlah</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id_pembayaran} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{payment.id_pembayaran}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{payment.pemesanan.layanan.nama_layanan}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {format(payment.tanggal_bayar, 'dd MMM yyyy', { locale: id })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{payment.metode}</td>
                                        <td className="px-6 py-4 text-right font-bold text-[#31694E]">
                                            Rp {payment.jumlah_bayar.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle2 size={12} />
                                                Lunas
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
