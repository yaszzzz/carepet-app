import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '@/components/molecules/AuthHeader/AuthHeader';
import { RegisterForm } from '@/components/organisms/RegisterForm/RegisterForm';

export default function RegisterPage() {
    return (
        <AuthLayout>
            <AuthHeader
                title="Create an account"
                subtitle="Start your journey with Care Pet today"
            />
            <RegisterForm />
        </AuthLayout>
    );
}
