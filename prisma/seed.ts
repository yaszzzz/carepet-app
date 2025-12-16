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
        const service = await prisma.layanan.upsert({
            where: { id_layanan: s.id_layanan },
            update: {},
            create: s,
        });
        console.log(`Upserted service with id: ${service.id_layanan}`);
    }

    // 2. Seed Users (Pengguna) - excluding Login/Register as requested, just dummy data
    // Using dummy passwords
    const dummyPassword = await hash('password123', 10);

    const users = [
        {
            id_pengguna: 'U00001',
            nama_pengguna: 'Budi Santoso',
            no_hp: '081234567890',
            alamat: 'Jl. Mawar No. 10, Jakarta',
            email: 'budi@example.com',
            password: dummyPassword,
        },
        {
            id_pengguna: 'U00002',
            nama_pengguna: 'Siti Aminah',
            no_hp: '089876543210',
            alamat: 'Jl. Melati No. 5, Bandung',
            email: 'siti@example.com',
            password: dummyPassword,
        },
        {
            id_pengguna: 'U00003',
            nama_pengguna: 'Rudi Hartono',
            no_hp: '085678901234',
            alamat: 'Jl. Anggrek No. 3, Surabaya',
            email: 'rudi@example.com',
            password: dummyPassword,
        },
    ];

    for (const u of users) {
        const user = await prisma.pengguna.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
        console.log(`Upserted user with id: ${user.id_pengguna}`);
    }

    // 3. Seed Pets (Hewan)
    const pets = [
        {
            id_hewan: 'H00001',
            id_pengguna: 'U00001', // Budi
            nama_hewan: 'Mochi',
            jenis: 'Kucing',
            usia: 2,
            kebutuhan_khusus: 'Alergi ikan',
        },
        {
            id_hewan: 'H00002',
            id_pengguna: 'U00001', // Budi
            nama_hewan: 'Choco',
            jenis: 'Anjing',
            usia: 3,
            kebutuhan_khusus: null,
        },
        {
            id_hewan: 'H00003',
            id_pengguna: 'U00002', // Siti
            nama_hewan: 'Luna',
            jenis: 'Kucing',
            usia: 1,
            kebutuhan_khusus: 'Butuh vitamin',
        },
        {
            id_hewan: 'H00004',
            id_pengguna: 'U00003', // Rudi
            nama_hewan: 'Rocky',
            jenis: 'Anjing',
            usia: 5,
            kebutuhan_khusus: 'Galak',
        },
    ];

    for (const p of pets) {
        const pet = await prisma.hewan.upsert({
            where: { id_hewan: p.id_hewan },
            update: {},
            create: p,
        });
        console.log(`Upserted pet with id: ${pet.id_hewan}`);
    }

    // 4. Seed Bookings (Pemesanan)
    const bookings = [
        {
            id_pemesanan: 'B0000001',
            id_hewan: 'H00001',
            id_layanan: 'L001',
            tgl_masuk: new Date('2023-12-01'),
            tgl_keluar: new Date('2023-12-01'),
            status: 'Selesai',
        },
        {
            id_pemesanan: 'B0000002',
            id_hewan: 'H00002',
            id_layanan: 'L003',
            tgl_masuk: new Date('2023-12-05'),
            tgl_keluar: new Date('2023-12-07'),
            status: 'Selesai',
        },
        {
            id_pemesanan: 'B0000003',
            id_hewan: 'H00003',
            id_layanan: 'L004',
            tgl_masuk: new Date('2023-12-10'),
            tgl_keluar: new Date('2023-12-10'),
            status: 'Proses',
        },
        {
            id_pemesanan: 'B0000004',
            id_hewan: 'H00004',
            id_layanan: 'L002',
            tgl_masuk: new Date('2023-12-15'),
            tgl_keluar: new Date('2023-12-15'),
            status: 'Pending',
        },
    ];

    for (const b of bookings) {
        const booking = await prisma.pemesanan.upsert({
            where: { id_pemesanan: b.id_pemesanan },
            update: {},
            create: b,
        });
        console.log(`Upserted booking with id: ${booking.id_pemesanan}`);
    }

    // 5. Seed Payments (Pembayaran)
    const payments = [
        {
            id_pembayaran: 'P0000001',
            id_pemesanan: 'B0000001',
            tanggal_bayar: new Date('2023-12-01'),
            jumlah_bayar: 150000,
            metode: 'Transfer',
        },
        {
            id_pembayaran: 'P0000002',
            id_pemesanan: 'B0000002',
            tanggal_bayar: new Date('2023-12-07'),
            jumlah_bayar: 200000, // 2 days x 100k
            metode: 'Tunai',
        },
        // B0000003 and B0000004 might not be paid yet or partially
    ];

    for (const pay of payments) {
        const payment = await prisma.pembayaran.upsert({
            where: { id_pembayaran: pay.id_pembayaran },
            update: {},
            create: pay,
        });
        console.log(`Upserted payment with id: ${payment.id_pembayaran}`);
    }

    console.log('Seeding finished.');
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
