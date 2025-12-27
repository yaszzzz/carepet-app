'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const userEmail = session.user.email;
    const user = await prisma.pengguna.findUnique({
        where: { email: userEmail },
        include: { hewan: true }
    });

    if (!user) return null;

    // Execute all count queries concurrently for better performance
    const [totalPets, activeBoardings, serviceOrders, historyCount, paymentCount] = await Promise.all([
        // 1. Total Pets
        prisma.hewan.count({
            where: { id_pengguna: user.id_pengguna }
        }),
        // 2. Active Boardings (Status NOT 'Selesai' and NOT 'Batal')
        prisma.pemesanan.count({
            where: {
                hewan: { id_pengguna: user.id_pengguna },
                status: { in: ['Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Lunas', 'Proses'] }
            }
        }),
        // 3. Service Orders (Total bookings made)
        prisma.pemesanan.count({
            where: {
                hewan: { id_pengguna: user.id_pengguna }
            }
        }),
        // 4. Completed/History count
        prisma.pemesanan.count({
            where: {
                hewan: { id_pengguna: user.id_pengguna },
                status: 'Selesai'
            }
        }),
        // 5. Payment transaction count
        prisma.pembayaran.count({
            where: {
                pemesanan: {
                    hewan: { id_pengguna: user.id_pengguna }
                }
            }
        })
    ]);

    return {
        totalPets,
        activeBoardings,
        serviceOrders,
        historyCount,
        paymentCount,
        userName: user.nama_pengguna
    };
}

export async function getActiveBoarding() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.pengguna.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return null;

    // Find one active boarding to display
    const activeBooking = await prisma.pemesanan.findFirst({
        where: {
            hewan: { id_pengguna: user.id_pengguna },
            status: { in: ['Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Lunas', 'Proses'] }, // Priorities for "Active" display
            tgl_keluar: { gte: new Date() } // Must not be expired
        },
        orderBy: { tgl_masuk: 'asc' },
        include: { hewan: true }
    });

    if (!activeBooking) return null;

    // Calculate days remaining
    const today = new Date();
    const end = new Date(activeBooking.tgl_keluar);
    const diffTime = end.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
        petName: activeBooking.hewan.nama_hewan,
        daysRemaining
    };
}
