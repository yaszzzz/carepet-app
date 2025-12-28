'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadToBlob } from '@/lib/blob';
import { createNotification } from '@/lib/actions/notifications';

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

    // Upload to Vercel Blob
    let proofUrl = '';
    try {
        proofUrl = await uploadToBlob(paymentProof, 'payments');
    } catch (error) {
        console.error('File Upload Error:', error);
        throw new Error('Gagal mengupload bukti pembayaran. Pastikan format file benar (JPG/PNG).');
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

        // Notify Admin
        await createNotification({
            userId: 'ADMIN',
            title: 'Pembayaran Baru',
            message: `Pembayaran untuk booking #${bookingId} menunggu verifikasi.`,
            type: 'INFO',
            link: '/admin/payments'
        });

    } catch (error) {
        console.error('Payment Error:', error);
        throw new Error('Gagal memproses pembayaran');
    }

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard/payments');
    revalidatePath('/dashboard/status');
    revalidatePath('/dashboard');
    revalidatePath('/admin/payments');
    redirect('/dashboard/history');
}

/**
 * Creates a Payment Token (Stub or Midtrans)
 * @param bookingId 
 */
export async function createPaymentToken(bookingId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    // 1. Verify Booking ownership
    const booking = await prisma.pemesanan.findFirst({
        where: {
            id_pemesanan: bookingId,
            hewan: {
                pengguna: { email: session.user.email || '' } // Handle null email
            }
        },
        include: { layanan: true }
    });

    if (!booking) return { error: 'Booking tidak ditemukan' };

    // 2. Mock Token Generation
    const mockToken = `mock_${bookingId}_${Date.now()}`;

    return {
        success: true,
        token: mockToken,
        redirect_url: null
    };
}

/**
 * Confirm Payment (Called after successful payment)
 * Updates status to 'Lunas'
 */
export async function confirmPayment(bookingId: string, paymentMethod: string = 'midtrans') {
    const booking = await prisma.pemesanan.findUnique({
        where: { id_pemesanan: bookingId },
        include: { layanan: true }
    });

    if (!booking) return { error: 'Booking not found' };

    const duration = Math.max(1, Math.ceil((new Date(booking.tgl_keluar).getTime() - new Date(booking.tgl_masuk).getTime()) / (86400000)));
    const total = duration * booking.layanan.harga;

    // Create Payment Record (Ensure unique ID)
    const lastPayment = await prisma.pembayaran.findFirst({ orderBy: { id_pembayaran: 'desc' } });
    let newId = 'PAY00001';
    if (lastPayment) {
        const idNum = parseInt(lastPayment.id_pembayaran.replace(/\D/g, '') || '0', 10);
        newId = `PAY${String(idNum + 1).padStart(5, '0')}`;
    }

    await prisma.pembayaran.create({
        data: {
            id_pembayaran: newId,
            id_pemesanan: bookingId,
            tanggal_bayar: new Date(),
            jumlah_bayar: total,
            metode: paymentMethod,
            bukti_bayar: 'midtrans-auto-verified'
        }
    });

    // Update Booking Status
    await prisma.pemesanan.update({
        where: { id_pemesanan: bookingId },
        data: { status: 'Lunas' } // Auto-confirm for Gateway
    });

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard/status');

    return { success: true };
}
