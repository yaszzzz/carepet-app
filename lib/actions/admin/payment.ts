'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/actions/notifications';

export async function verifyPayment(paymentId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    try {
        const payment = await prisma.pembayaran.findUnique({
            where: { id_pembayaran: paymentId },
            include: {
                pemesanan: {
                    include: {
                        hewan: {
                            select: { id_pengguna: true }
                        }
                    }
                }
            }
        });

        if (!payment) return { error: 'Payment not found' };

        // Update Booking Status to 'Lunas'
        await prisma.pemesanan.update({
            where: { id_pemesanan: payment.id_pemesanan },
            data: { status: 'Lunas' }
        });

        // Create Notification for User
        if (payment.pemesanan.hewan.id_pengguna) { // Need to include this relation in query above
            await prisma.notifikasi.create({
                data: {
                    userId: payment.pemesanan.hewan.id_pengguna,
                    title: 'Pembayaran Diterima',
                    message: `Pembayaran sebesar Rp ${payment.jumlah_bayar.toLocaleString('id-ID')} telah diverifikasi successfully.`,
                    type: 'SUCCESS',
                    link: '/dashboard/history'
                }
            });
        }

        revalidatePath('/admin/payments');
        revalidatePath('/admin/dashboard');
        revalidatePath('/dashboard/payments');
        revalidatePath('/dashboard/history');
        revalidatePath('/dashboard/status');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal verifikasi pembayaran' };
    }
}
