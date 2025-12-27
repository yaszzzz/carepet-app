import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Plus, Search } from 'lucide-react'; // Added Search icon if needed, though SearchInput handles it
import { redirect } from 'next/navigation';
import { AdminServiceCard } from '@/components/molecules/AdminServiceCard/AdminServiceCard';
import Link from 'next/link';
import { SearchInput } from '@/components/atoms/SearchInput/SearchInput';

export default async function AdminServicesPage(props: {
    searchParams: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const query = searchParams?.query || '';

    const services = await prisma.layanan.findMany({
        where: {
            nama_layanan: {
                contains: query,
                mode: 'insensitive',
            }
        },
        orderBy: { id_layanan: 'desc' }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Layanan</h1>
                    <p className="text-gray-400 mt-1">Daftar layanan yang tersedia untuk pelanggan.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchInput placeholder="Cari layanan..." />
                    <Link href="/admin/services/add">
                        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto">
                            <Plus size={20} />
                            <span>Tambah Layanan</span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800 rounded-xl border border-gray-700">
                        <p>Tidak ada layanan yang ditemukan.</p>
                    </div>
                ) : (
                    services.map((service) => (
                        <AdminServiceCard
                            key={service.id_layanan}
                            id={service.id_layanan}
                            name={service.nama_layanan}
                            description={service.deskripsi}
                            price={service.harga}
                        />
                    ))
                )}
            </div>
        </AdminDashboardLayout>
    );
}
