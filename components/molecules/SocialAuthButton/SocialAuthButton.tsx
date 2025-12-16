import React from 'react';

export interface SocialAuthButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export const SocialAuthButton = ({ icon, label, onClick, disabled }: SocialAuthButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span className="text-gray-600">{icon}</span>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </button>
    );
};
