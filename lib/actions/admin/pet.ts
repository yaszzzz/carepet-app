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
