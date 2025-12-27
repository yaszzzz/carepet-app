'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateServiceAdmin(id: string, data: { name: string; description: string; price: number }) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    try {
        await prisma.layanan.update({
            where: { id_layanan: id },
            data: {
                nama_layanan: data.name,
                deskripsi: data.description,
                harga: data.price
            }
        });

        revalidatePath('/admin/services');
        revalidatePath('/dashboard/services');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal update layanan' };
    }
}

export async function createServiceAdmin(data: { name: string; description: string; price: number }) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    try {
        // Generate simple ID if needed or let DB handle if auto-inc (Schema says VARCHAR(5) input needed?)
        // Schema: id_layanan String @id @db.VarChar(5)
        // We need a generator.
        const count = await prisma.layanan.count();
        const newId = `S${(count + 1).toString().padStart(3, '0')}`; // S001, S002

        await prisma.layanan.create({
            data: {
                id_layanan: newId,
                nama_layanan: data.name,
                deskripsi: data.description,
                harga: data.price
            }
        });

        revalidatePath('/admin/services');
        revalidatePath('/dashboard/services');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal buat layanan' };
    }
}
