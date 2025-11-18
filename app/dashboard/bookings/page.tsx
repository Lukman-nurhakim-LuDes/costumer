// app/dashboard/bookings/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import AddBookingForm from '@/components/AddBookingForm';
import { Package } from 'lucide-react';

// Tipe data yang diambil dari Prisma Client (Manual Definition)
interface ClientData {
    id: string;
    name: string;
    email: string;
    // Tambahkan properti lain yang Anda select jika ada
}

export default async function BookingsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  const userId = user.id;

  // 1. Ambil Klien dan Layanan untuk Dropdown
  // Menggunakan as ClientData[] untuk type assertion
  const clients = await prisma.client.findMany({
    where: { userId: userId },
    select: { id: true, name: true, email: true },
  }) as ClientData[]; // <-- Type Assertion

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
      {/* ... (Kode lainnya) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulir Pemesanan (KIRI - 1/3) */}
        <div className="lg:col-span-1">
            <AddBookingForm 
                // PERBAIKAN: Menggunakan explicit type annotation (c: ClientData)
                clients={clients.map((c: ClientData) => ({ id: c.id, name: `${c.name} (${c.email})` }))}
                services={services}
            />
        </div>

        {/* ... (Sisa kode halaman) ... */}
      </div>
    </div>
  );
}