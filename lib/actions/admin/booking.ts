'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/actions/notifications';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

export async function updateBookingStatus(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    const id_pemesanan = formData.get('id_pemesanan') as string;
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string | null;
    const photo = formData.get('photo') as File | null;

    if (!id_pemesanan || !status) {
        return { error: 'Invalid data' };
    }

    let photoUrl = '';
    let oldPhotoUrl: string | null = null;

    try {
        if (photo && photo.size > 0) {
            // Fetch old booking photo
            const existingBooking = await prisma.pemesanan.findUnique({
                where: { id_pemesanan },
                select: { foto_kondisi: true }
            });
            oldPhotoUrl = existingBooking?.foto_kondisi || null;

            photoUrl = await uploadToBlob(photo, 'updates');
        }

        await prisma.pemesanan.update({
            where: { id_pemesanan },
            data: {
                status,
                ...(notes && { catatan: notes }),
                ...(photoUrl && { foto_kondisi: photoUrl })
            }
        });

        // Create Notification for User
        const booking = await prisma.pemesanan.findUnique({
            where: { id_pemesanan },
            select: { hewan: { select: { id_pengguna: true } } }
        });

        if (booking?.hewan.id_pengguna) {
            // Create status-specific notification
            let notifTitle = 'Update Status Booking';
            let notifMessage = `Status booking Anda: ${status}`;
            let notifType: 'INFO' | 'SUCCESS' | 'WARNING' = 'INFO';
            let notifLink = '/dashboard/status';

            switch (status) {
                case 'Lunas':
                    notifTitle = 'Pembayaran Diterima';
                    notifMessage = 'Pembayaran Anda telah diverifikasi. Hewan siap untuk check-in.';
                    notifType = 'SUCCESS';
                    notifLink = '/dashboard/status';
                    break;
                case 'Proses':
                    notifTitle = 'Hewan Sudah Check-in';
                    notifMessage = `Hewan Anda sudah masuk penitipan. ${notes ? `Catatan: ${notes}` : ''}`;
                    notifType = 'SUCCESS';
                    break;
                case 'Selesai':
                    notifTitle = 'Penitipan Selesai';
                    notifMessage = 'Hewan Anda sudah selesai dititipkan. Silakan jemput!';
                    notifType = 'SUCCESS';
                    notifLink = '/dashboard/history';
                    break;
                case 'Dibatalkan':
                    notifTitle = 'Booking Dibatalkan';
                    notifMessage = 'Booking Anda telah dibatalkan.';
                    notifType = 'WARNING';
                    break;
                default:
                    notifMessage = `Status: ${status}. ${notes ? `Catatan: ${notes}` : ''} ${photoUrl ? '(Ada foto baru)' : ''}`;
            }

            await prisma.notifikasi.create({
                data: {
                    userId: booking.hewan.id_pengguna,
                    title: notifTitle,
                    message: notifMessage,
                    type: notifType,
                    link: notifLink
                }
            });
        }

        revalidatePath('/admin/boarding');
        revalidatePath('/admin/dashboard');
        revalidatePath('/dashboard/status');
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/history');

        if (photoUrl && oldPhotoUrl) {
            await deleteFromBlob(oldPhotoUrl);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to update booking status:', error);
        return { error: 'Gagal memperbarui status' };
    }
}
