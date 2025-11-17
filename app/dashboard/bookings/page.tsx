import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import AddBookingForm from '@/components/AddBookingForm';
import { Package } from 'lucide-react';
// import BookingTable from '@/components/BookingTable'; // Akan dibuat nanti

export default async function BookingsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  const userId = user.id;

  // 1. Ambil Klien dan Layanan untuk Dropdown
  const clients = await prisma.client.findMany({
    where: { userId: userId },
    select: { id: true, name: true, email: true },
  });

  const services = await prisma.service.findMany({
    where: { userId: userId },
    select: { id: true, name: true, basePrice: true },
  });

  // 2. Ambil Semua Pemesanan yang Ada
  const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      select: { id: true, title: true, date: true, status: true, client: { select: { name: true } }, service: { select: { name: true } } },
      orderBy: { date: 'desc' },
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Manajemen Pemesanan ({bookings.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulir Pemesanan (KIRI - 1/3) */}
        <div className="lg:col-span-1">
            <AddBookingForm 
                clients={clients.map(c => ({ id: c.id, name: `${c.name} (${c.email})` }))}
                services={services}
            />
        </div>

        {/* Tabel Pemesanan (KANAN - 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><Package className="w-5 h-5 mr-2" />Daftar Semua Pemesanan</h2>
          
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Belum ada pemesanan. Buat pemesanan pertama Anda di samping.
            </p>
          ) : (
            // <BookingTable data={bookings} /> // Akan diisi dengan komponen tabel
            <ul className="divide-y divide-gray-100">
                {bookings.map(b => (
                    <li key={b.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{b.title}</p>
                            <p className="text-sm text-gray-600">Klien: {b.client.name} | Layanan: {b.service.name}</p>
                        </div>
                        <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-white ${b.status === 'Scheduled' ? 'bg-indigo-500' : 'bg-green-500'}`}>{b.status}</span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(b.date).toLocaleDateString()}</p>
                        </div>
                    </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}