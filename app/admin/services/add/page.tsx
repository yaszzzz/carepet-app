import { auth } from '@/auth';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { AdminServiceForm } from '@/components/organisms/AdminServiceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AddServicePage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/admin/login');
    }

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <Link
                    href="/admin/services"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Tambah Layanan Baru</h1>
                <p className="text-gray-400 mt-1">Tambahkan layanan baru ke dalam sistem.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl border border-gray-700 p-6">
                <AdminServiceForm />
            </div>
        </AdminDashboardLayout>
    );
}
