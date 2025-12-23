import { auth } from '@/auth';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Check } from 'lucide-react';
import { markAsRead, markAllAsRead } from '@/lib/actions/notifications';
import { revalidatePath } from 'next/cache';

const typeIcons = {
    INFO: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    SUCCESS: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    WARNING: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ERROR: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const notifications = await prisma.notifikasi.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    async function handleMarkAllRead() {
        'use server';
        await markAllAsRead();
        revalidatePath('/dashboard/notifications');
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Notifikasi</h1>
                        <p className="text-gray-100 mt-1">
                            {unreadCount > 0
                                ? `Anda memiliki ${unreadCount} notifikasi belum dibaca`
                                : 'Semua notifikasi sudah dibaca'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <form action={handleMarkAllRead}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-[#658C58] text-white rounded-lg hover:bg-[#31694E] transition-colors text-sm font-medium"
                            >
                                <Check size={16} />
                                Tandai Semua Dibaca
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada notifikasi</h3>
                    <p className="text-gray-500">Notifikasi akan muncul di sini</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => {
                        const typeConfig = typeIcons[notif.type as keyof typeof typeIcons] || typeIcons.INFO;
                        const Icon = typeConfig.icon;

                        return (
                            <div
                                key={notif.id_notifikasi}
                                className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${notif.isRead
                                        ? 'border-gray-100 opacity-70'
                                        : 'border-l-4 border-l-[#658C58] border-gray-200'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon size={20} className={typeConfig.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`font-semibold ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {format(notif.createdAt, 'dd MMM, HH:mm', { locale: localeId })}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 ${notif.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                            {notif.message}
                                        </p>
                                        {!notif.isRead && (
                                            <form action={async () => {
                                                'use server';
                                                await markAsRead(notif.id_notifikasi);
                                                revalidatePath('/dashboard/notifications');
                                            }}>
                                                <button
                                                    type="submit"
                                                    className="text-xs text-[#658C58] hover:underline mt-2"
                                                >
                                                    Tandai sudah dibaca
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
