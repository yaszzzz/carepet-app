
import { prisma } from './lib/prisma';
import { hashPassword } from './lib/auth-utils';

async function main() {
    console.log('Testing DB Registration...');
    const email = 'test_' + Date.now() + '@example.com';
    const password = await hashPassword('password123');

    try {
        console.log('Creating user with email:', email);
        const user = await prisma.pengguna.create({
            data: {
                id_pengguna: 'TEST' + Math.floor(Math.random() * 1000), // Random ID to avoid collision
                nama_pengguna: 'Test User',
                email: email,
                password: password,
                no_hp: '08123456789',
                alamat: 'Test Address'
            }
        });
        console.log('User created:', user);

        console.log('Attempting to create duplicate email...');
        try {
            await prisma.pengguna.create({
                data: {
                    id_pengguna: 'TEST' + Math.floor(Math.random() * 1000) + '2',
                    nama_pengguna: 'Test User 2',
                    email: email, // Same email
                    password: password,
                    no_hp: '08123456789',
                    alamat: 'Test Address'
                }
            });
        } catch (e: any) {
            if (e.code === 'P2002') {
                console.log('Caught expected P2002 error for unique email.');
            } else {
                console.error('Caught UNEXPECTED error for duplicate email:', e);
            }
        }

    } catch (error) {
        console.error('Error creating user:', JSON.stringify(error, null, 2));
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
