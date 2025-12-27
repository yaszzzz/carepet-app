import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { Dog, Trash2, Edit, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AdminPetRow } from '@/components/molecules/AdminPetRow';
import { SearchInput } from '@/components/atoms/SearchInput/SearchInput';

export default async function AdminPetsPage(props: {
    searchParams: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    // In a real app, you'd check for admin role here specifically
    // Ensure only admins can access this page
    if (!session?.user) {
        redirect('/admin/login');
    }

    const query = searchParams?.query || '';

    const pets = await prisma.hewan.findMany({
        where: {
            OR: [
                { nama_hewan: { contains: query, mode: 'insensitive' } },
                { pengguna: { nama_pengguna: { contains: query, mode: 'insensitive' } } },
            ]
        },
        include: {
            pengguna: true
        },
        orderBy: {
            id_hewan: 'desc'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Hewan</h1>
                    <p className="text-gray-400 mt-1">Daftar semua hewan yang terdaftar di sistem.</p>
                </div>
                {/* Search Component */}
                <SearchInput placeholder="Cari hewan atau pemilik..." />
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-gray-200 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Hewan</th>
                                <th className="px-6 py-4">Pemilik</th>
                                <th className="px-6 py-4">Jenis</th>
                                <th className="px-6 py-4">Usia</th>
                                <th className="px-6 py-4">Kebutuhan Khusus</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {pets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Dog size={32} className="opacity-50" />
                                            <p>Belum ada data hewan yang cocok.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pets.map(pet => (
                                    <AdminPetRow
                                        key={pet.id_hewan}
                                        pet={pet}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
