'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addService(formData: FormData) {
    const session = await auth();
    // Verify admin role if possible, or just session existence for now
    if (!session?.user?.email) { // Simple check, ideally check role
        return { error: 'Unauthorized' };
    }

    const nama_layanan = formData.get('nama_layanan') as string;
    const harga = parseInt(formData.get('harga') as string);
    const deskripsi = formData.get('deskripsi') as string;

    if (!nama_layanan || isNaN(harga)) {
        return { error: 'Mohon lengkapi data wajib' };
    }

    try {
        // Generate ID: SV001, etc.
        const lastService = await prisma.layanan.findFirst({
            orderBy: { id_layanan: 'desc' }
        });

        let newId = 'SV001';
        if (lastService) {
            const lastNumber = parseInt(lastService.id_layanan.replace('SV', ''));
            newId = `SV${String(lastNumber + 1).padStart(3, '0')}`;
        }

        await prisma.layanan.create({
            data: {
                id_layanan: newId,
                nama_layanan,
                harga,
                deskripsi: deskripsi || ''
            }
        });

        revalidatePath('/admin/services');
        revalidatePath('/dashboard/services');
        return { success: true };
    } catch (error) {
        console.error('Failed to add service:', error);
        return { error: 'Gagal menambahkan layanan' };
    }
}

export async function deleteService(id: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.layanan.delete({
            where: { id_layanan: id }
        });

        revalidatePath('/admin/services');
        revalidatePath('/dashboard/services');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete service:', error);
        return { error: 'Gagal menghapus layanan' };
    }
}
