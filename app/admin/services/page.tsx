import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { ShoppingCart, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminServicesPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    const services = await prisma.layanan.findMany();

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Layanan</h1>
                    <p className="text-gray-400 mt-1">Daftar layanan yang tersedia untuk pelanggan.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    <Plus size={20} />
                    <span>Tambah Layanan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id_layanan} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <ShoppingCart size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                                    <Edit size={16} />
                                </button>
                                <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{service.nama_layanan}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.deskripsi}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Harga</span>
                            <span className="text-lg font-bold text-emerald-400">
                                Rp {service.harga.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AdminDashboardLayout>
    );
}
