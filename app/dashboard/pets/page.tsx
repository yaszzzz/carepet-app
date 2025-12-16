import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { PetCard } from '@/components/molecules/PetCard/PetCard';
import { Plus, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PetsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const pets = await prisma.hewan.findMany({
        where: {
            id_pengguna: session.user.id
        }
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Hewan Peliharaan Saya</h1>
                    <p className="text-gray-500 mt-1">Daftar hewan kesayangan yang terdaftar.</p>
                </div>
                <Link
                    href="/dashboard/pets/add"
                    className="inline-flex items-center justify-center gap-2 bg-[#658C58] text-white px-5 py-2.5 rounded-lg hover:bg-[#557A47] transition-colors shadow-md font-medium"
                >
                    <Plus size={20} />
                    <span>Tambah Hewan</span>
                </Link>
            </div>

            {pets.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PawPrint size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada hewan</h3>
                    <p className="text-gray-500 mb-6">Mulai dengan menambahkan hewan peliharaan Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id_hewan}
                            name={pet.nama_hewan}
                            type={pet.jenis}
                            age={pet.usia}
                            specialNeeds={pet.kebutuhan_khusus}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
