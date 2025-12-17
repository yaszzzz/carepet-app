'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePetAdmin(id_hewan: string, data: {
    nama_hewan: string;
    jenis: string;
    usia: number;
    kebutuhan_khusus?: string | null;
}) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    try {
        await prisma.hewan.update({
            where: { id_hewan },
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
        return { error: 'Gagal update hewan' };
    }
}

export async function deletePetAdmin(id_hewan: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    try {
        await prisma.hewan.delete({
            where: { id_hewan }
        });
        revalidatePath('/admin/pets');
        return { success: true };
    } catch (error) {
        return { error: 'Gagal hapus hewan' };
    }
}
