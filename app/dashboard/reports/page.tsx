// app/dashboard/reports/page.tsx
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { BarChart, TrendingUp, DollarSign } from 'lucide-react';
import RevenueChart from '@/components/RevenueChart'; 

// Mendefinisikan tipe data untuk hasil query payments
interface PaymentData {
    amount: number;
    paymentDate: Date;
    // Tambahkan properti lain yang Anda select jika ada
}

export default async function ReportsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak.</div>;
  }
  
  const userId = user.id;

  // 1. Ambil data Pembayaran dan Booking
  const [payments, bookings] = await Promise.all([
    // Type assertion untuk hasil pembayaran
    prisma.payment.findMany({
      where: { userId: userId, paymentStatus: 'Fully Paid' },
      select: { amount: true, paymentDate: true },
      orderBy: { paymentDate: 'asc' },
    }) as Promise<PaymentData[]>, 
    
    prisma.booking.findMany({
      where: { userId: userId },
      select: { price: true },
    }),
  ]);

  // 2. Proses Data untuk Grafik (Agregasi Bulanan)
  const monthlyRevenueMap = new Map<string, number>();
  
  // FIX: Menambahkan tipe eksplisit ke parameter 'p'
  payments.forEach((p: PaymentData) => { 
    const monthYear = p.paymentDate.toISOString().substring(0, 7); // Format YYYY-MM
    const currentRevenue = monthlyRevenueMap.get(monthYear) || 0;
    monthlyRevenueMap.set(monthYear, currentRevenue + p.amount);
  });

  const revenueData = Array.from(monthlyRevenueMap, ([month, revenue]) => ({
    name: month,
    Pendapatan: revenue,
  }));
  
  // 3. Hitung Metrik Kunci
  const totalRevenueAllTime = payments.reduce((sum, p) => sum + p.amount, 0); // Di sini, sum sudah diturunkan dari Map<string, number>
  const totalBookingsCount = bookings.length;
  const averageBookingValue = totalBookingsCount > 0 ? totalRevenueAllTime / totalBookingsCount : 0;


  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-8 h-8 mr-3 text-indigo-600" /> Laporan Analisis Bisnis
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Laporan Pendapatan (2/3 Kolom) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2" />Pendapatan Bulanan</h2>
          
          {revenueData.length > 0 ? (
            <RevenueChart data={revenueData} /> 
          ) : (
            <p className="text-center text-gray-500 py-10">Belum ada data pendapatan untuk ditampilkan di grafik.</p>
          )}
        </div>
        
        {/* Metrik Kunci (1/3 Kolom) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><BarChart className="w-5 h-5 mr-2" />Metrik Kunci</h2>
          <div className="space-y-3">
              <p className="font-medium">Total Pemesanan: <span className="text-lg text-indigo-600">{totalBookingsCount}</span></p>
              <p className="font-medium">Total Pendapatan (Semua): <span className="text-lg text-green-600">Rp{totalRevenueAllTime.toLocaleString('id-ID')}</span></p>
              <p className="font-medium">Rata-rata Nilai Pemesanan: <span className="text-lg text-blue-600">Rp{averageBookingValue.toLocaleString('id-ID')}</span></p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            *Data diambil dari pembayaran yang berstatus LUNAS.
          </p>
        </div>
      </div>
    </div>
  );
}
