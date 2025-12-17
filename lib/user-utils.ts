import { prisma } from '@/lib/prisma';

/**
 * Generates a unique User ID in the format PGxxxx (e.g., PG0001)
 * Handles race conditions/collisions with retries.
 */
export async function generateUserId(): Promise<string> {
    const MAX_RETRIES = 5;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            // Fetch the last few users to ensure we get a valid number
            const lastUsers = await prisma.pengguna.findMany({
                where: {
                    id_pengguna: {
                        startsWith: 'PG'
                    }
                },
                orderBy: { id_pengguna: 'desc' },
                take: 5
            });

            let maxId = 0;
            if (lastUsers.length > 0) {
                for (const user of lastUsers) {
                    const idStr = user.id_pengguna.replace('PG', '');
                    // strict check for digits
                    if (/^\d+$/.test(idStr)) {
                        const num = parseInt(idStr, 10);
                        if (num > maxId) maxId = num;
                    }
                }
            }

            const newId = `PG${String(maxId + 1).padStart(4, '0')}`;

            // Check if this ID already exists (double check before returning)
            const existing = await prisma.pengguna.findUnique({
                where: { id_pengguna: newId }
            });

            if (!existing) {
                return newId;
            }

            // If exists, retry (loop will re-calculate maxId or we could increment locally, 
            // but re-fetching is safer if another transaction just committed)
            attempt++;
        } catch (error) {
            console.error('Error generating User ID:', error);
            throw new Error('Gagal membuat ID Pengguna');
        }
    }

    throw new Error('Gagal membuat ID unik setelah beberapa percobaan.');
}
