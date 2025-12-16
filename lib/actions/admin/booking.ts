'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatus(id_pemesanan: string, status: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.pemesanan.update({
            where: { id_pemesanan },
            data: { status }
        });

        revalidatePath('/admin/boarding');
        revalidatePath('/dashboard/status');
        return { success: true };
    } catch (error) {
        console.error('Failed to update booking status:', error);
        return { error: 'Gagal memperbarui status' };
    }
}
