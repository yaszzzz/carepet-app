import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Button/Button';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { processPayment } from '@/lib/actions/payment';
import { PaymentInterface } from '@/components/organisms/PaymentInterface';

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;

    const booking = await prisma.pemesanan.findUnique({
        where: { id_pemesanan: id },
        include: {
            layanan: true,
            hewan: true,
        }
    });

    if (!booking) {
        return (
            <DashboardLayout>
                <div className="text-center py-20 text-red-500">Booking tidak ditemukan.</div>
            </DashboardLayout>
        );
    }

    // Calculate duration
    const start = new Date(booking.tgl_masuk);
    const end = new Date(booking.tgl_keluar);
    const durationMs = end.getTime() - start.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = durationDays * booking.layanan.harga;

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Pembayaran</CardTitle>
                        <CardDescription>Selesaikan pembayaran untuk memproses booking Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">ID Booking</span>
                                <span className="font-medium text-gray-900">{booking.id_pemesanan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Layanan</span>
                                <span className="font-medium text-gray-900">{booking.layanan.nama_layanan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hewan</span>
                                <span className="font-medium text-gray-900">{booking.hewan.nama_hewan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tanggal</span>
                                <span className="font-medium text-gray-900">
                                    {format(start, 'dd MMM', { locale: localeId })} - {format(end, 'dd MMM yyyy', { locale: localeId })}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                <span className="text-gray-800 font-semibold">Total Tagihan</span>
                                <span className="text-xl font-bold text-[#658C58]">
                                    Rp {totalAmount.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Payment Interface */}
                        <PaymentInterface booking={booking} totalAmount={totalAmount} />

                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
