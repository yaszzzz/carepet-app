'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deletePetAdmin(id: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.hewan.delete({
            where: { id_hewan: id }
        });

        revalidatePath('/admin/pets');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete pet (admin):', error);
        return { error: 'Gagal menghapus hewan' };
    }
}

export async function updatePetAdmin(
    id: string,
    data: {
        nama_hewan: string;
        jenis: string;
        usia: number;
        kebutuhan_khusus?: string | null;
    }
) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.hewan.update({
            where: { id_hewan: id },
            data: {
                nama_hewan: data.nama_hewan,
                jenis: data.jenis,
                usia: data.usia,
                kebutuhan_khusus: data.kebutuhan_khusus
            }
        });

        revalidatePath('/admin/pets');
        return { success: true };
    } catch (error) {
        console.error('Failed to update pet (admin):', error);
        return { error: 'Gagal mengupdate informasi hewan' };
    }
}
