'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { writeFile } from 'fs/promises'; // Import file system module
import { join } from 'path';

export async function processPayment(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const bookingId = formData.get('bookingId') as string;
    const amount = Number(formData.get('amount'));
    const methodType = formData.get('methodType') as string;
    const paymentProvider = formData.get('paymentProvider') as string;
    const paymentProof = formData.get('paymentProof') as File;

    if (!bookingId || !amount || !methodType || !paymentProvider || !paymentProof) {
        throw new Error('Invalid payment data');
    }

    // Save File Locally
    let proofUrl = '';
    try {
        const bytes = await paymentProof.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure directory exists (create manually if not in production)
        const uploadDir = join(process.cwd(), 'public/uploads/payments');
        // We assume the directory exists or we could add mkdir logic here

        const fileName = `${bookingId}-${Date.now()}-${paymentProof.name}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        proofUrl = `/uploads/payments/${fileName}`;

    } catch (error) {
        console.error('File Upload Error:', error);
        throw new Error('Gagal mengupload bukti pembayaran');
    }


    try {
        // 1. Create Payment Record
        const lastPayment = await prisma.pembayaran.findFirst({
            orderBy: { id_pembayaran: 'desc' },
        });

        // Simple ID generation
        let newId = 'PAY00001';
        if (lastPayment) {
            const idNum = parseInt(lastPayment.id_pembayaran.replace(/\D/g, '') || '0', 10);
            newId = `PAY${String(idNum + 1).padStart(5, '0')}`;
        }

        // Format Method String
        const methodString = `${methodType.toUpperCase()} - ${paymentProvider.toUpperCase()}`;

        await prisma.pembayaran.create({
            data: {
                id_pembayaran: newId,
                id_pemesanan: bookingId,
                tanggal_bayar: new Date(),
                jumlah_bayar: amount,
                metode: methodString,
                bukti_bayar: proofUrl,
            }
        });

        // 2. Update Booking Status
        await prisma.pemesanan.update({
            where: { id_pemesanan: bookingId },
            data: { status: 'Menunggu Konfirmasi' }
        });

    } catch (error) {
        console.error('Payment Error:', error);
        throw new Error('Gagal memproses pembayaran');
    }

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard/payments');
    redirect('/dashboard/history');
}
