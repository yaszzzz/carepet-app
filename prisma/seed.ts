import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Seed Services (Layanan)
    const services = [
        {
            id_layanan: 'L001',
            nama_layanan: 'Grooming Kucing',
            harga: 150000,
            deskripsi: 'Mandikan, potong kuku, dan bersihkan telinga kucing.',
        },
        {
            id_layanan: 'L002',
            nama_layanan: 'Grooming Anjing',
            harga: 200000,
            deskripsi: 'Mandikan, potong kuku, dan bersihkan telinga anjing.',
        },
        {
            id_layanan: 'L003',
            nama_layanan: 'Penitipan Harian',
            harga: 100000,
            deskripsi: 'Penitipan hewan per hari dengan makan 2x.',
        },
        {
            id_layanan: 'L004',
            nama_layanan: 'Vaksinasi',
            harga: 300000,
            deskripsi: 'Vaksinasi lengkap untuk kesehatan hewan.',
        },
    ];

    for (const s of services) {
        await prisma.layanan.upsert({
            where: { id_layanan: s.id_layanan },
            update: {},
            create: s,
        });
    }

    // 2. Seed Users
    const password = await hash('password123', 10);
    const users = [
        {
            id_pengguna: 'U10001',
            nama_pengguna: 'Budi Santoso',
            no_hp: '081234567890',
            alamat: 'Jl. Mawar No. 10, Jakarta',
            email: 'budi@test.com',
            password,
        },
        {
            id_pengguna: 'U10002',
            nama_pengguna: 'Siti Aminah',
            no_hp: '089876543210',
            alamat: 'Jl. Melati No. 5, Bandung',
            email: 'siti@test.com',
            password,
        }
    ];

    for (const u of users) {
        await prisma.pengguna.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }

    // 3. Seed Pets
    const pets = [
        {
            id_hewan: 'H10001',
            id_pengguna: 'U10001', // Budi
            nama_hewan: 'Mochi',
            jenis: 'Kucing',
            usia: 2,
            kebutuhan_khusus: 'Alergi ikan',
        },
        {
            id_hewan: 'H10002',
            id_pengguna: 'U10001', // Budi
            nama_hewan: 'Choco',
            jenis: 'Anjing',
            usia: 3,
            kebutuhan_khusus: null,
        },
        {
            id_hewan: 'H10003',
            id_pengguna: 'U10002', // Siti
            nama_hewan: 'Luna',
            jenis: 'Kucing',
            usia: 1,
            kebutuhan_khusus: 'Butuh vitamin',
        }
    ];

    for (const p of pets) {
        await prisma.hewan.upsert({
            where: { id_hewan: p.id_hewan },
            update: {},
            create: p,
        });
    }

    // 4. Seed Bookings & Notifications (Dynamic Dates)
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

    // Booking 1: Active (Proses) - started yesterday, ends tomorrow
    const booking1 = {
        id_pemesanan: 'B1000001',
        id_hewan: 'H10001',
        id_layanan: 'L003', // Penitipan
        tgl_masuk: yesterday,
        tgl_keluar: tomorrow,
        status: 'Proses',
        catatan: 'Tolong update foto setiap pagi.',
        foto_kondisi: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', // Dummy cat image
    };

    // Booking 2: Pending Payment - starts tomorrow
    const booking2 = {
        id_pemesanan: 'B1000002',
        id_hewan: 'H10002',
        id_layanan: 'L001', // Grooming
        tgl_masuk: tomorrow,
        tgl_keluar: tomorrow,
        status: 'Menunggu Pembayaran',
    };

    // Booking 3: Pending Confirmation - starts next week - Triggers Admin Alert
    const booking3 = {
        id_pemesanan: 'B1000003',
        id_hewan: 'H10003',
        id_layanan: 'L004', // Vaksin
        tgl_masuk: nextWeek,
        tgl_keluar: nextWeek,
        status: 'Menunggu Konfirmasi',
    };

    const bookings = [booking1, booking2, booking3];

    for (const b of bookings) {
        await prisma.pemesanan.upsert({
            where: { id_pemesanan: b.id_pemesanan },
            update: { status: b.status }, // Update status to reset tests
            create: b,
        });
    }

    // 5. Seed Payments for active booking
    // Payment for B1 (Proses) should exist
    await prisma.pembayaran.upsert({
        where: { id_pembayaran: 'P1000001' },
        update: {},
        create: {
            id_pembayaran: 'P1000001',
            id_pemesanan: 'B1000001',
            tanggal_bayar: yesterday,
            jumlah_bayar: 200000,
            metode: 'Transfer',
            bukti_bayar: 'dummy_proof.jpg'
        }
    });

    // 6. Seed Notifications (Important for Admin Alerts)
    // Create a new notification for Admin about the "Menunggu Konfirmasi" booking
    await prisma.notifikasi.create({
        data: {
            userId: 'ADMIN',
            title: 'Pesanan Baru Perlu Konfirmasi',
            message: 'Siti Aminah memesan Vaksinasi untuk Luna.',
            type: 'INFO',
            link: '/admin/boarding?query=B1000003',
            isRead: false
        }
    });

    // Notification for user Budi
    await prisma.notifikasi.create({
        data: {
            userId: 'U10001',
            title: 'Update Kondisi Mochi',
            message: 'Mochi baru saja makan dengan lahap.',
            type: 'SUCCESS',
            isRead: false
        }
    });

    console.log('Dummy data injected successfully!');
    console.log('Login Users: budi@test.com / password123');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
