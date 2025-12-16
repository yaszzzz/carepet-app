'use client';

import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { PawPrint, Calendar, AlertCircle } from 'lucide-react';

interface PetCardProps {
    name: string;
    type: string;
    age: number;
    specialNeeds?: string | null;
}

export const PetCard = ({ name, type, age, specialNeeds }: PetCardProps) => {
    return (
        <Card hover shadow="md" className="h-full border-2 border-transparent hover:border-[#658C58]/30 transition-all">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#658C58]/10 to-[#BBC863]/10 p-6 flex flex-col items-center justify-center text-center border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-3">
                        <PawPrint size={40} className="text-[#658C58]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-[#658C58] shadow-sm mt-2">
                        {type}
                    </span>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} className="text-[#BBC863]" />
                        <span className="text-sm">Usia: <span className="font-semibold text-gray-800">{age} Tahun</span></span>
                    </div>
                    {specialNeeds && (
                        <div className="flex items-start gap-3 text-gray-600">
                            <AlertCircle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Note: <span className="font-medium text-gray-800 italic">"{specialNeeds}"</span></span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
