import { auth } from '@/auth';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { redirect } from 'next/navigation';
import { AdminSettingsForms } from '@/components/organisms/AdminSettingsForms';

export default async function AdminSettingsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Pengaturan Akun</h1>
                <p className="text-gray-400 mt-1">Kelola informasi profil admin dan keamanan.</p>
            </div>

            <AdminSettingsForms user={session.user} />
        </AdminDashboardLayout>
    );
}
