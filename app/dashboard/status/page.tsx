import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { Clock, CheckCircle2, AlertCircle, Calendar, PawPrint } from 'lucide-react';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function StatusPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const activeBookings = await prisma.pemesanan.findMany({
        where: {
            hewan: {
                id_pengguna: session.user.id
            },
            status: {
                in: ['Proses', 'Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Lunas'] // Include all active statuses
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Status Penitipan</h1>
                <p className="text-gray-100 mt-1">Pantau status terkini hewan peliharaan Anda.</p>
            </div>

            {activeBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada penitipan aktif</h3>
                    <p className="text-gray-500">Semua hewan kesayangan Anda sudah dirumah.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeBookings.map((booking) => (
                        <Card key={booking.id_pemesanan} shadow="md" className="border-l-4 border-l-[#BBC863]">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{booking.hewan.nama_hewan}</CardTitle>
                                        <CardDescription>{booking.hewan.jenis} • {booking.hewan.usia} Tahun</CardDescription>
                                    </div>
                                    <span className="px-3 py-1 bg-[#BBC863]/20 text-[#31694E] rounded-full text-xs font-bold uppercase">
                                        {booking.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-[#658C58]">
                                        <PawPrint size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Layanan</p>
                                        <p className="font-medium text-gray-900">{booking.layanan.nama_layanan}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={12} /> Masuk
                                        </p>
                                        <p className="font-medium text-gray-900">{format(booking.tgl_masuk, 'dd MMM yyyy', { locale: id })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={12} /> Keluar
                                        </p>
                                        <p className="font-medium text-gray-900">{format(booking.tgl_keluar, 'dd MMM yyyy', { locale: id })}</p>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                        <span>Progres</span>
                                        <span>Sedang Berjalan</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-[#BBC863] h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>

                                {/* Condition Update */}
                                {(booking.catatan || booking.foto_kondisi) && (
                                    <div className="mt-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <p className="text-xs font-semibold text-[#658C58] mb-2 uppercase tracking-wide">Update Terkini</p>
                                        {booking.foto_kondisi && (
                                            <div className="mb-2 rounded-md overflow-hidden h-40 w-full relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={booking.foto_kondisi}
                                                    alt="Kondisi Hewan"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                        {booking.catatan && (
                                            <p className="text-sm text-gray-600 italic">
                                                "{booking.catatan}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
