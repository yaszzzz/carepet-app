import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AdminServiceCard } from '@/components/molecules/AdminServiceCard'; // Ensure this import path is correct based on where you created it
import Link from 'next/link';

export default async function AdminServicesPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const services = await prisma.layanan.findMany({
        orderBy: { id_layanan: 'desc' }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Layanan</h1>
                    <p className="text-gray-400 mt-1">Daftar layanan yang tersedia untuk pelanggan.</p>
                </div>
                <Link href="/admin/services/add">
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={20} />
                        <span>Tambah Layanan</span>
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <AdminServiceCard
                        key={service.id_layanan}
                        id={service.id_layanan}
                        name={service.nama_layanan}
                        description={service.deskripsi}
                        price={service.harga}
                    />
                ))}
            </div>
        </AdminDashboardLayout>
    );
}
