// app/dashboard/reports/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { BarChart, TrendingUp, DollarSign } from 'lucide-react';
import RevenueChart from '@/components/RevenueChart'; // Akan dibuat

export default async function ReportsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak.</div>;
  }
  
  const userId = user.id;

  // 1. Ambil data Pembayaran dan Booking
  const [payments, bookings] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: userId, paymentStatus: 'Fully Paid' },
      select: { amount: true, paymentDate: true },
      orderBy: { paymentDate: 'asc' },
    }),
    prisma.booking.findMany({
      where: { userId: userId },
      select: { date: true },
      orderBy: { date: 'asc' },
    }),
  ]);

  // 2. Proses Data untuk Grafik (Contoh Sederhana: Agregasi Bulanan)
  const monthlyRevenueMap = new Map<string, number>();
  
  payments.forEach(p => {
    const monthYear = p.paymentDate.toISOString().substring(0, 7); // Format YYYY-MM
    const currentRevenue = monthlyRevenueMap.get(monthYear) || 0;
    monthlyRevenueMap.set(monthYear, currentRevenue + p.amount);
  });

  const revenueData = Array.from(monthlyRevenueMap, ([month, revenue]) => ({
    name: month,
    Pendapatan: revenue,
  }));
  // ------------------------------------------------------------------------

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-8 h-8 mr-3 text-indigo-600" /> Laporan Analisis Bisnis
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Laporan Pendapatan (2/3 Kolom) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2" />Pendapatan Bulanan (6 Bulan Terakhir)</h2>
          
          {revenueData.length > 0 ? (
            <RevenueChart data={revenueData} /> // Komponen Grafik
          ) : (
            <p className="text-center text-gray-500 py-10">Belum ada data pembayaran lunas untuk ditampilkan.</p>
          )}
        </div>
        
        {/* Metrik Kunci (1/3 Kolom) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><BarChart className="w-5 h-5 mr-2" />Metrik Kunci</h2>
          <p>Total Pemesanan: {bookings.length}</p>
          <p>Rata-rata Nilai Pemesanan: Rp...</p>
          <p className="mt-4 text-sm text-gray-500">
            *Membutuhkan implementasi lebih lanjut untuk menghitung rata-rata dan metrik lain.
          </p>
        </div>
      </div>
    </div>
  );
}