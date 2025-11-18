// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'; // <-- TAMBAHKAN BARIS INI


import { Activity, Clock, UserCheck, DollarSign } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  
  // Ambil data user untuk memastikan login
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect ke halaman login jika belum login
    return (
        <div className="p-10 text-center text-red-600">
            Akses Ditolak. Silakan login untuk melihat dashboard.
        </div>
    );
  }
  
  // --- Ambil Data Statistik Nyata ---
  const userId = user.id; 
  
  const [totalClients, bookingsInProgress, totalRevenue] = await Promise.all([
    prisma.client.count({ where: { userId: userId } }),
    prisma.booking.count({ where: { userId: userId, status: 'Scheduled' } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { userId: userId, paymentStatus: 'Fully Paid' },
    }),
  ]);
  
  // FIX: Tambahkan 'as const' di akhir array stats
  const stats = [
    { 
      title: 'Total Klien', 
      value: totalClients.toLocaleString(), 
      icon: UserCheck, 
      color: 'blue', // Literal type
      change: 'Data dari Database',
    },
    { 
      title: 'Booking Aktif', 
      value: bookingsInProgress.toLocaleString(), 
      icon: Clock, 
      color: 'yellow', // Literal type
      change: 'Menunggu Sesi Foto',
    },
    { 
      title: 'Total Pendapatan', 
      value: `Rp${(totalRevenue._sum.amount || 0).toLocaleString('id-ID')}`, 
      icon: DollarSign, 
      color: 'green', // Literal type
      change: 'Pembayaran Lunas',
    },
    { 
      title: 'Layanan Aktif', 
      value: '4', 
      icon: Activity, 
      color: 'red', // Literal type
      change: '4 Tipe Layanan',
    },
  ] as const; // <-- INI ADALAH PERBAIKANNYA
  // ------------------------------------

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Selamat Datang Kembali, {user.email?.split('@')[0] || 'Fotografer'}!
      </h1>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Bagian Laporan dan Jadwal (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Grafik Booking Bulanan</h2>
          <p className="text-gray-500">Integrasi Grafik akan ditampilkan di sini.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Jadwal Minggu Ini</h2>
          <p className="text-gray-500">Akses halaman Kalender untuk detail.</p>
        </div>
      </div>
    </div>
  );
}