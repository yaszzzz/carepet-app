'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

export async function updateProfilePicture(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    const photo = formData.get('photo') as File | null;
    if (!photo || photo.size === 0) return { error: 'No photo uploaded' };

    try {
        const currentUser = await prisma.pengguna.findUnique({
            where: { id_pengguna: session.user.id },
            select: { foto: true }
        });

        const photoUrl = await uploadToBlob(photo, 'profiles');

        await prisma.pengguna.update({
            where: { id_pengguna: session.user.id },
            data: { foto: photoUrl }
        });

        // Cleanup old photo
        if (currentUser?.foto) {
            await deleteFromBlob(currentUser.foto);
        }

        revalidatePath('/dashboard/settings');
        revalidatePath('/', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return { error: 'Gagal update foto profil' };
    }
}
