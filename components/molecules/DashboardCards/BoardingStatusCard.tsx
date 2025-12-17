'use client';

import { Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import Link from 'next/link';

interface BoardingStatusCardProps {
    data?: {
        petName: string;
        daysRemaining: number;
    } | null;
}

export const BoardingStatusCard = ({ data }: BoardingStatusCardProps) => {
    const hasActiveBoarding = !!data;

    return (
        <Link href="/dashboard/status">
            <Card hover shadow="lg" className="group cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                    <div className={`p-6 ${hasActiveBoarding ? 'bg-gradient-to-r from-[#658C58] to-[#31694E]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-105 transition-transform ${hasActiveBoarding ? 'bg-white/20' : 'bg-gradient-to-br from-[#658C58] to-[#31694E]'}`}>
                                    <Clock size={28} className={hasActiveBoarding ? 'text-white' : 'text-white'} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-lg font-bold ${hasActiveBoarding ? 'text-white' : 'text-gray-900'}`}>Status Penitipan</h3>
                                        {hasActiveBoarding && (
                                            <span className="px-2 py-0.5 rounded-full bg-[#F0E491] text-[#31694E] text-xs font-bold animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm ${hasActiveBoarding ? 'text-white/80' : 'text-gray-500'}`}>
                                        {hasActiveBoarding ? `${data?.petName} sedang dititipkan` : 'Tidak ada penitipan aktif'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {hasActiveBoarding && (
                                    <div className="text-right hidden sm:block">
                                        <p className="text-2xl font-bold text-white">{data?.daysRemaining}</p>
                                        <p className="text-xs text-white/70">Hari tersisa</p>
                                    </div>
                                )}
                                <ChevronRight size={24} className={`${hasActiveBoarding ? 'text-white/70' : 'text-gray-400'} group-hover:translate-x-1 transition-all`} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
