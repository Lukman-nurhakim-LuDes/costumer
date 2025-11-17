// app/dashboard/page.tsx

import { Activity, Clock, UserCheck, DollarSign } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma'; // <-- Impor Prisma Client

// Fungsi Server Component
export default async function DashboardPage() {
  
  // 1. Ambil User ID dari Supabase (Wajib untuk RLS)
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Di lingkungan nyata, ini akan mengarah ke halaman login
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  // ID pengguna yang terotentikasi dari Supabase Auth
  const userId = user.id; 

  // 2. Ambil Data Nyata Menggunakan Prisma
  // Karena RLS aktif, kita tetap memfilter di kode untuk keamanan dan efisiensi query
  
  const totalClients = await prisma.client.count({
    where: { userId: userId },
  });

  const bookingsInProgress = await prisma.booking.count({
    where: { 
      userId: userId,
      status: 'Scheduled', // Status yang menandakan proyek aktif
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      userId: userId,
      paymentStatus: 'Fully Paid', // Hanya hitung pembayaran yang lunas
    },
  });

  // --- Data Statistik yang Dinamis ---
  const stats = [
    { 
      title: 'Total Klien', 
      value: totalClients.toLocaleString(), 
      icon: UserCheck, 
      color: 'blue', 
      change: 'Data dari Database',
    },
    { 
      title: 'Booking Aktif', 
      value: bookingsInProgress.toLocaleString(), 
      icon: Clock, 
      color: 'yellow', 
      change: 'Menunggu Sesi Foto',
    },
    { 
      title: 'Total Pendapatan', 
      value: `$${(totalRevenue._sum.amount || 0).toFixed(2)}`, 
      icon: DollarSign, 
      color: 'green', 
      change: 'Pembayaran Lunas',
    },
    { 
      title: 'Layanan Aktif', 
      value: '4', // Placeholder: Ini bisa dihitung dari tabel Service
      icon: Activity, 
      color: 'red', 
      change: '4 Tipe Layanan',
    },
  ];
  // ------------------------------------

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Halo, {user.email?.split('@')[0] || 'Fotografer'}!
      </h1>
      
      {/* Container untuk Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Bagian Laporan dan Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Grafik Booking</h2>
          <p className="text-gray-500">Akan menampilkan grafik tren pemesanan.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Jadwal Minggu Ini</h2>
          <p className="text-gray-500">Daftar sesi foto yang akan datang.</p>
        </div>
      </div>
    </div>
  );
}