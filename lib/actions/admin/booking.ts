'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/actions/notifications';

export async function updateBookingStatus(id_pemesanan: string, status: string, notes?: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.pemesanan.update({
            where: { id_pemesanan },
            data: {
                status,
                ...(notes && { catatan: notes })
            }
        });

        // Create Notification for User
        const booking = await prisma.pemesanan.findUnique({
            where: { id_pemesanan },
            select: { hewan: { select: { id_pengguna: true } } }
        });

        if (booking?.hewan.id_pengguna) {
            await prisma.notifikasi.create({
                data: {
                    userId: booking.hewan.id_pengguna,
                    title: 'Status Pesanan Diperbarui',
                    message: `Status pesanan kamu sekarang: ${status}. ${notes ? `Catatan: ${notes}` : ''}`,
                    type: 'INFO',
                    link: '/dashboard/status'
                }
            });
        }

        revalidatePath('/admin/boarding');
        revalidatePath('/dashboard/status');
        return { success: true };
    } catch (error) {
        console.error('Failed to update booking status:', error);
        return { error: 'Gagal memperbarui status' };
    }
}
