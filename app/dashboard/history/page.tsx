import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { Calendar, Clock, PawPrint, ShoppingBag, History as HistoryIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function HistoryPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const bookings = await prisma.pemesanan.findMany({
        where: {
            hewan: {
                id_pengguna: session.user.id
            }
        },
        include: {
            hewan: true,
            layanan: true
        },
        orderBy: {
            tgl_masuk: 'desc'
        }
    });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Riwayat Penitipan</h1>
                <p className="text-gray-100 mt-1">Daftar riwayat penitipan dan layanan hewan Anda.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HistoryIcon size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada riwayat</h3>
                    <p className="text-gray-500">Anda belum melakukan pemesanan layanan.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <Card key={booking.id_pemesanan} hover shadow="sm">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${booking.status === 'Selesai' ? 'bg-green-100 text-green-600' :
                                            booking.status === 'Proses' ? 'bg-blue-100 text-blue-600' :
                                                'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900">{booking.layanan.nama_layanan}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Proses' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <PawPrint size={14} />
                                                    <span>{booking.hewan.nama_hewan} ({booking.hewan.jenis})</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    <span>{format(booking.tgl_masuk, 'dd MMM yyyy', { locale: id })} - {format(booking.tgl_keluar, 'dd MMM yyyy', { locale: id })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right border-t md:border-t-0 pt-4 md:pt-0">
                                        <p className="text-xs text-gray-500 mb-1">ID Pemesanan</p>
                                        <p className="font-mono text-sm font-medium text-gray-700">#{booking.id_pemesanan}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
