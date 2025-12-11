'use client';

import { Shield } from 'lucide-react';
import { H2, P } from '@/components/atoms/Typography/Typography';

interface AdminLoginHeaderProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export const AdminLoginHeader = ({
    title = "Admin Panel",
    subtitle = "Silakan masuk untuk mengakses dashboard admin",
    className = ""
}: AdminLoginHeaderProps) => {
    return (
        <div className={`text-center mb-8 ${className}`}>
            {/* Admin Badge */}
            <div className="flex justify-center mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                    <Shield className="h-10 w-10 text-white" />
                </div>
            </div>

            {/* Title */}
            <H2 className="text-white mb-2 text-2xl font-bold">{title}</H2>

            {/* Subtitle */}
            <P className="text-gray-400 text-sm">{subtitle}</P>
        </div>
    );
};
