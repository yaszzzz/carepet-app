'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function processPayment(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const bookingId = formData.get('bookingId') as string;
    const amount = Number(formData.get('amount'));

    if (!bookingId || !amount) {
        throw new Error('Invalid payment data');
    }

    try {
        // 1. Create Payment Record (Simulated)
        const lastPayment = await prisma.pembayaran.findFirst({
            orderBy: { id_pembayaran: 'desc' },
        });

        // Simple ID generation for Payment
        let newId = 'PAY00001';
        if (lastPayment) {
            const idNum = parseInt(lastPayment.id_pembayaran.replace(/\D/g, '') || '0', 10);
            newId = `PAY${String(idNum + 1).padStart(5, '0')}`;
        }

        await prisma.pembayaran.create({
            data: {
                id_pembayaran: newId,
                id_pemesanan: bookingId,
                tanggal_bayar: new Date(),
                jumlah_bayar: amount,
                metode: 'Virtual Account',
            }
        });

        // 2. Update Booking Status
        await prisma.pemesanan.update({
            where: { id_pemesanan: bookingId },
            data: { status: 'Menunggu Konfirmasi' }
        });

    } catch (error) {
        console.error('Payment Error:', error);
        // In a real app we would return an error state
        throw new Error('Gagal memproses pembayaran');
    }

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard/payments');
    redirect('/dashboard/history');
}
