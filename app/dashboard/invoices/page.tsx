// app/dashboard/invoices/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { DollarSign } from 'lucide-react';
import PaymentForm from '@/components/PaymentForm'; // <-- KOMPONEN FORM

// Fungsi Server Component
export default async function InvoicesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  const userId = user.id;

  // Ambil semua Booking beserta pembayaran dan klien terkait
  const bookingsWithPayments = await prisma.booking.findMany({
      where: { userId: userId },
      select: { 
          id: true, 
          title: true, 
          price: true, 
          status: true,
          client: { select: { name: true, email: true } },
          payments: { select: { amount: true, paymentDate: true, paymentStatus: true } }
      },
      orderBy: { date: 'desc' }
  });
  
  // Mendefinisikan tipe data Payment secara eksplisit dari hasil query
  type PaymentItem = typeof bookingsWithPayments[0]['payments'][0];

  // Fungsi utilitas untuk menghitung total dibayar
  const calculateTotals = (booking: typeof bookingsWithPayments[0]) => {
    // FIX: Tentukan tipe 'sum' sebagai number dan 'p' sebagai PaymentItem
    const totalPaid = booking.payments.reduce((sum: number, p: PaymentItem) => sum + p.amount, 0); 
    const remainingDue = booking.price - totalPaid;
    return { totalPaid, remainingDue };
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <DollarSign className="w-8 h-8 mr-3 text-green-600" /> Manajemen Faktur & Pembayaran
      </h1>
      
      {bookingsWithPayments.length === 0 ? (
          <p className="text-center text-gray-500 py-10 bg-white rounded-xl shadow">
              Belum ada pemesanan yang dicatat untuk dilacak pembayarannya.
          </p>
      ) : (
          <div className="space-y-6">
              {bookingsWithPayments.map((booking) => {
                  const { totalPaid, remainingDue } = calculateTotals(booking);
                  const isFullyPaid = remainingDue <= 0;
                  
                  return (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h2 className="text-xl font-bold">{booking.title}</h2>
                                  <p className="text-sm text-gray-600">Klien: {booking.client.name} ({booking.client.email})</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-lg font-semibold">Total Nilai: Rp{booking.price.toLocaleString('id-ID')}</p>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${isFullyPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {isFullyPaid ? 'Lunas' : `Sisa Tagihan: Rp${remainingDue.toLocaleString('id-ID')}`}
                                  </span>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                              {/* Kolom Pembayaran yang Dicatat */}
                              <div>
                                  <h3 className="font-semibold mb-2">Riwayat Pembayaran</h3>
                                  {booking.payments.length === 0 ? (
                                      <p className="text-xs text-gray-400">Belum ada pembayaran dicatat.</p>
                                  ) : (
                                      <ul className="text-sm space-y-1">
                                          {booking.payments.map((p, index) => (
                                              <li key={index} className="flex justify-between border-b border-dotted pb-1">
                                                  <span>Rp{p.amount.toLocaleString('id-ID')}</span>
                                                  <span className={`text-xs ${p.paymentStatus === 'Fully Paid' ? 'text-green-600' : 'text-indigo-600'}`}>{p.paymentStatus}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  )}
                              </div>

                              {/* Kolom Formulir Catat Pembayaran */}
                              <div className="border-l pl-4">
                                  <PaymentForm bookingId={booking.id} remainingDue={remainingDue} /> 
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
}