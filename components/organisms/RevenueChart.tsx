'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: '#374151', opacity: 0.4 }}
                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                />
                <Bar
                    dataKey="total"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
