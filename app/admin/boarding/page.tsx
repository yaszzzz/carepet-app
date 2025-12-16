import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { redirect } from 'next/navigation';
import { AdminBookingCard } from '@/components/molecules/AdminBookingCard';

export default async function AdminBoardingPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/admin/login');
    }

    const bookings = await prisma.pemesanan.findMany({
        include: {
            hewan: {
                select: {
                    nama_hewan: true,
                    jenis: true
                }
            },
            hewan: {
                include: {
                    pengguna: {
                        select: {
                            nama_pengguna: true,
                            no_hp: true
                        }
                    }
                }
            },
            layanan: {
                select: {
                    nama_layanan: true
                }
            }
        },
        orderBy: {
            tgl_masuk: 'desc'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Penitipan</h1>
                <p className="text-gray-400 mt-1">Pantau dan kelola status penitipan hewan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <AdminBookingCard
                        key={booking.id_pemesanan}
                        booking={booking as any} // Temporary type assertion if needed, or fix props
                    />
                ))}
            </div>
        </AdminDashboardLayout>
    );
}
