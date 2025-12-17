'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function updateProfilePicture(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    const photo = formData.get('photo') as File | null;
    if (!photo || photo.size === 0) return { error: 'No photo uploaded' };

    try {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public/uploads/profiles');
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${session.user.id}-${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        const photoUrl = `/uploads/profiles/${fileName}`;

        await prisma.pengguna.update({
            where: { id_pengguna: session.user.id },
            data: { foto: photoUrl }
        });

        revalidatePath('/dashboard/settings');
        revalidatePath('/', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return { error: 'Gagal update foto profil' };
    }
}
