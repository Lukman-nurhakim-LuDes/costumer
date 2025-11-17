// components/Sidebar.tsx
'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, FileText, DollarSign, Package } from 'lucide-react';

const navItems = [
  { name: 'Dasbor', href: '/dashboard', icon: Home },
  { name: 'Kalender', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Pemesanan', href: '/dashboard/bookings', icon: Package },
  { name: 'Klien', href: '/dashboard/clients', icon: Users },
  { name: 'Faktur', href: '/dashboard/invoices', icon: DollarSign },
  { name: 'Laporan', href: '/dashboard/reports', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg h-full p-4 border-r border-gray-100">
      <div className="text-2xl font-extrabold text-indigo-700 mb-8">
        Studio Pro
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-xl transition-colors 
                    ${isActive 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}