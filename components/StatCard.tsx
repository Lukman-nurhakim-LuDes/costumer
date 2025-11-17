// components/StatCard.tsx
import { Icon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: Icon; // Menggunakan Icon type dari lucide-react
  color: 'blue' | 'yellow' | 'green' | 'red';
}

// Map warna ke kelas Tailwind CSS
const colorMap = {
  blue: { bg: 'bg-blue-100/50', text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-100/50', text: 'text-yellow-600' },
  green: { bg: 'bg-green-100/50', text: 'text-green-600' },
  red: { bg: 'bg-red-100/50', text: 'text-red-600' },
};

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue; // Default ke biru

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start">
        {/* Ikon */}
        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {/* Nilai Utama */}
        <p className="text-4xl font-extrabold text-gray-900 leading-none">
          {value}
        </p>
      </div>

      {/* Judul dan Perubahan */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className={`text-sm mt-1 ${colors.text}`}>
          {change}
        </p>
      </div>
    </div>
  );
}