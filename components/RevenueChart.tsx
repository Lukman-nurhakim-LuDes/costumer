// components/RevenueChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  Pendapatan: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  
  // Memformat label sumbu Y menjadi format mata uang
  const formatCurrency = (value: number) => {
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
          <Tooltip 
            formatter={(value) => [`Rp${(value as number).toLocaleString('id-ID')}`, 'Pendapatan']}
            labelFormatter={(label) => `Bulan: ${label}`}
          />
          <Legend />
          <Bar dataKey="Pendapatan" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}