import { AdminAuthLayout } from '@/components/templates/AdminAuthLayout/AdminAuthLayout';
import { AdminLoginHeader } from '@/components/molecules/AdminLoginHeader/AdminLoginHeader';
import { AdminLoginForm } from '@/components/organisms/AdminLoginForm/AdminLoginForm';

export default function AdminLoginPage() {
    return (
        <AdminAuthLayout>
            <AdminLoginHeader
                title="Admin Panel"
                subtitle="Silakan masuk untuk mengakses dashboard admin"
            />
            <AdminLoginForm />
        </AdminAuthLayout>
    );
}
