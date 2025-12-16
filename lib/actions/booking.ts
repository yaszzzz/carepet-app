'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function createBooking(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const id_layanan = formData.get('id_layanan') as string;
    const id_hewan = formData.get('id_hewan') as string;
    const tgl_masuk = formData.get('tgl_masuk') as string;
    const tgl_keluar = formData.get('tgl_keluar') as string;

    if (!id_layanan || !id_hewan || !tgl_masuk || !tgl_keluar) {
        return { error: 'Mohon lengkapi semua data' };
    }

    // Validate dates
    const start = new Date(tgl_masuk);
    const end = new Date(tgl_keluar);

    if (start >= end) {
        return { error: 'Tanggal keluar harus setelah tanggal masuk' };
    }

    if (start < new Date()) {
        return { error: 'Tanggal masuk tidak boleh di masa lalu' };
    }

    try {
        const lastBooking = await prisma.pemesanan.findFirst({
            orderBy: { id_pemesanan: 'desc' }
        });

        let newId = 'PM000001';

        if (lastBooking) {
            const idNumber = lastBooking.id_pemesanan.replace(/\D/g, ''); // Remove non-digits
            const lastNumber = parseInt(idNumber || '0', 10);
            if (!isNaN(lastNumber)) {
                newId = `PM${String(lastNumber + 1).padStart(6, '0')}`;
            }
        }

        // Create new booking
        const newBooking = await prisma.pemesanan.create({
            data: {
                id_pemesanan: newId,
                id_hewan,
                id_layanan,
                tgl_masuk: start,
                tgl_keluar: end,
                status: 'Menunggu Pembayaran',
                // catatan: formData.get('catatan') as string || null // DISABLED TEMPORARILY: Requires server restart
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        });

        // 2. Redirect/Revalidate
        // Instead of just revalidating, we might want to return the ID for the redirect
        revalidatePath('/dashboard/history');

        // Check if we need to redirect to payment
        return { success: true, bookingId: newId, booking: newBooking };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return { success: false, error: 'Gagal membuat booking' };
    }
}
