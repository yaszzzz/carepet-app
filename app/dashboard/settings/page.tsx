'use client';

import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { AccountSettingsCard } from '@/components/molecules/DashboardCards';
import { Settings } from 'lucide-react';

export default function ClientSettingsPage() {
    return (
        <DashboardLayout>
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#658C58]/10">
                        <Settings size={24} className="text-[#658C58]" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
                        <p className="text-gray-500 text-sm sm:text-base">Kelola informasi profil dan keamanan akun Anda.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <AccountSettingsCard />
            </div>
        </DashboardLayout>
    );
}
