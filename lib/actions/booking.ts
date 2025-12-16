'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
        // Generate ID: PM000001
        const lastBooking = await prisma.pemesanan.findFirst({
            orderBy: { id_pemesanan: 'desc' }
        });

        let newId = 'PM000001';
        if (lastBooking) {
            const lastNumber = parseInt(lastBooking.id_pemesanan.replace('PM', ''));
            newId = `PM${String(lastNumber + 1).padStart(6, '0')}`;
        }

        await prisma.pemesanan.create({
            data: {
                id_pemesanan: newId,
                id_hewan,
                id_layanan,
                tgl_masuk: start,
                tgl_keluar: end,
                status: 'Menunggu',
                catatan: formData.get('catatan') as string || null
            } as any
        });

        revalidatePath('/dashboard/history');
        revalidatePath('/dashboard/status');
        return { success: true };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return { error: 'Gagal membuat pemesanan' };
    }
}
