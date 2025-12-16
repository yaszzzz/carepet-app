'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

export async function addPet(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const nama_hewan = formData.get('nama_hewan') as string;
    const jenis = formData.get('jenis') as string;
    const usia = parseInt(formData.get('usia') as string);
    const kebutuhan_khusus = formData.get('kebutuhan_khusus') as string;

    if (!nama_hewan || !jenis || isNaN(usia)) {
        return { error: 'Mohon lengkapi semua data wajib' };
    }

    try {
        // Generate ID: HW0001, etc.
        const lastPet = await prisma.hewan.findFirst({
            orderBy: { id_hewan: 'desc' }
        });

        let newId = 'HW0001';
        if (lastPet) {
            const lastNumber = parseInt(lastPet.id_hewan.replace('HW', ''));
            newId = `HW${String(lastNumber + 1).padStart(4, '0')}`;
        }

        await prisma.hewan.create({
            data: {
                id_hewan: newId,
                id_pengguna: session.user.id,
                nama_hewan,
                jenis,
                usia,
                kebutuhan_khusus: kebutuhan_khusus || null
            }
        });

        revalidatePath('/dashboard/pets');
        return { success: true };
    } catch (error) {
        console.error('Failed to add pet:', error);
        return { error: 'Gagal menambahkan hewan' };
    }
}

export async function deletePet(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Verify ownership
        const pet = await prisma.hewan.findUnique({
            where: { id_hewan: id }
        });

        if (!pet || pet.id_pengguna !== session.user.id) {
            return { error: 'Unauthorized' };
        }

        await prisma.hewan.delete({
            where: { id_hewan: id }
        });

        revalidatePath('/dashboard/pets');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete pet:', error);
        return { error: 'Gagal menghapus hewan' };
    }
}
