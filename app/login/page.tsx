import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '@/components/molecules/AuthHeader/AuthHeader';
import { LoginForm } from '@/components/organisms/LoginForm/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthHeader
                title="Welcome back"
                subtitle="Please enter your details to sign in"
            />
            <LoginForm />
        </AuthLayout>
    );
}
