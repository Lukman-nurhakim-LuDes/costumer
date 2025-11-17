// components/Sidebar.tsx
'use client'
import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, DollarSign, Clock, Menu } from 'lucide-react';

const navItems = [
  { name: 'Dasbor', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Pemesanan', href: '/bookings', icon: Clock },
  { name: 'Klien', href: '/clients', icon: Users },
  { name: 'Faktur', href: '/invoices', icon: FileText },
  { name: 'Laporan', href: '/reports', icon: DollarSign },
];

// Helper function untuk menggabungkan class Tailwind
const clsx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Untuk mobile

  return (
    <>
      {/* Tombol Toggle Mobile */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-40">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-700 bg-white rounded-md shadow-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar - Desktop (md:block) dan Mobile (isOpen) */}
      <div
        className={clsx(
          'flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo dan Judul */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Studio Pro</h1>
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href} // Menggunakan href langsung untuk navigasi Server Component
              className={clsx(
                // Tambahkan logika isActive di sini jika path cocok
                // Placeholder: semua item aktif saat ini
                'flex items-center px-4 py-3 text-base font-medium rounded-xl transition duration-150',
                item.name === 'Dasbor'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              )}
              onClick={() => setIsOpen(false)} // Tutup sidebar setelah klik di mobile
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}