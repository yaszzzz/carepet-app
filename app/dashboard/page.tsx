import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import {
    PetProfileCard,
    BoardingHistoryCard,
    ServiceOrderCard,
    BoardingStatusCard,
    PaymentHistoryCard,
    AccountSettingsCard
} from '@/components/molecules/DashboardCards';
import { getDashboardStats, getActiveBoarding } from '@/lib/actions/dashboard';

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const activeBoarding = await getActiveBoarding();

    return (
        <DashboardLayout>
            {/* Dashboard Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 mt-1 text-sm sm:text-base">
                    Selamat datang kembali, {stats?.userName || 'Pet Lover'}! Kelola hewan peliharaan Anda dengan mudah.
                </p>
            </div>

            {/* Status Penitipan Aktif - Full Width */}
            <div className="mb-6" id="status">
                <BoardingStatusCard data={activeBoarding} />
            </div>

            {/* Main Grid - Responsive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div id="pets">
                    <PetProfileCard />
                </div>
                <div id="services">
                    <ServiceOrderCard count={stats?.serviceOrders || 0} />
                </div>
                <div id="boarding-history">
                    <BoardingHistoryCard count={stats?.historyCount || 0} />
                </div>
                <div id="payments">
                    <PaymentHistoryCard count={stats?.paymentCount || 0} />
                </div>
            </div>

            {/* Account Settings - Full Width */}
            <div id="settings">
                <AccountSettingsCard />
            </div>
        </DashboardLayout>
    );
}
