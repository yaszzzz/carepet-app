import { ReactNode } from 'react';
import { Button } from '@/components/atoms/Button/Button';

interface SocialAuthButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
}

export const SocialAuthButton = ({ icon, label, onClick }: SocialAuthButtonProps) => {
    return (
        <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onClick}
            type="button"
        >
            {icon}
            <span>{label}</span>
        </Button>
    );
};
