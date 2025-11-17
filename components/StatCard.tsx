// components/StatCard.tsx
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const iconBgClass = colorClasses[color];
  
  return (
    <div className="flex-1 min-w-0 bg-white p-5 rounded-2xl shadow-lg transition-transform hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${iconBgClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
      </div>
      {change && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className={`text-sm font-medium ${color === 'green' ? 'text-green-500' : 'text-gray-500'}`}>
            {change}
          </p>
        </div>
      )}
    </div>
  );
}