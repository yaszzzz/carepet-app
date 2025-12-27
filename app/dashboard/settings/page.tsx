import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { AccountSettingsForm } from '@/components/organisms/AccountSettingsForm/AccountSettingsForm';
import { redirect } from 'next/navigation';
import { Settings } from 'lucide-react';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const user = await prisma.pengguna.findUnique({
        where: { id_pengguna: session.user.id }
    });

    if (!user) {
        redirect('/login');
    }

    // Map Prisma user to the shape expected by form if needed, or just pass user
    // The form uses: name (from session or user), email, no_hp, alamat
    const userData = {
        name: user.nama_pengguna,
        email: user.email,
        no_hp: user.no_hp,
        alamat: user.alamat
    };

    return (
        <DashboardLayout>
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#658C58]/10">
                        <Settings size={24} className="text-[#658C58]" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Pengaturan Akun</h1>
                        <p className="text-gray-100 text-sm sm:text-base">Kelola informasi profil dan keamanan akun Anda.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <AccountSettingsForm user={userData} />
            </div>
        </DashboardLayout>
    );
}
