'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/actions/notifications';

import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    try {
        if (photo && photo.size > 0) {
            const bytes = await photo.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure directory exists - reusing the one created for payments or creating new one
            // We can reuse 'public/uploads' but maybe 'public/uploads/updates'
            const uploadDir = join(process.cwd(), 'public/uploads/updates');

            // We need to ensure logic to create directory if not exists.
            // Since I cannot run command easily here without check, I will assume public/uploads exists
            // and maybe put it there or just use public/uploads/payments for now?
            // Better to use a generic 'public/uploads' folder.
            // Let's assume 'public/uploads' exists because of payments work.

            const fileName = `status-${id_pemesanan}-${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const filePath = join(process.cwd(), 'public/uploads', fileName); // Save to root uploads for simplicity or payments

            // Actually, let's use the 'public/uploads/payments' folder I created earlier to be safe,
            // or stick to 'public/uploads' if I am sure.
            // I created 'public/uploads/payments'. 
            // I should create 'public/uploads/updates'.

            // For now, let's just use the same folder to avoid errors, or try to save to 'public/uploads/payments' 
            // even if semantic is wrong, it works. 
            // OR I can use 'fs' to check/mkdir but 'fs' is not promised. 'fs/promises' has mkdir.

            // Let's try to be clean.
            const { mkdir } = require('fs/promises');
            await mkdir(join(process.cwd(), 'public/uploads/updates'), { recursive: true });

            const finalPath = join(process.cwd(), 'public/uploads/updates', fileName);
            await writeFile(finalPath, buffer);
            photoUrl = `/uploads/updates/${fileName}`;
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
        return { success: true };
    } catch (error) {
        console.error('Failed to update booking status:', error);
        return { error: 'Gagal memperbarui status' };
    }
}
