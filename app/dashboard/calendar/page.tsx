// app/dashboard/calendar/page.tsx
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import BookingCalendar from '@/components/BookingCalendar';
import { Package } from 'lucide-react'; 

// Tipe data untuk event kalender (untuk BookingCalendar.tsx)
interface BookingEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
}

// PERBAIKAN: Tipe data untuk hasil query Prisma (rawBookings)
// Harus mencerminkan HASIL data, BUKAN struktur query 'select'.
interface RawBookingData {
    id: string;
    title: string;
    date: Date; 
    status: string;
    // FIX: client sekarang adalah objek yang berisi properti 'name', bukan objek 'select'
    client: { name: string }; 
}

export default async function CalendarPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  const userId = user.id;

  // 1. Ambil semua Pemesanan
  const rawBookings = await prisma.booking.findMany({
      where: { userId: userId },
      select: { 
          id: true, 
          title: true, 
          date: true, 
          status: true,
          client: { select: { name: true } }, // Struktur query yang benar
      },
  }) as unknown as RawBookingData[]; // Type Assertion

  // 2. Transformasi data ke format yang dibutuhkan Kalender
  const calendarEvents: BookingEvent[] = rawBookings.map((booking: RawBookingData) => { 
      
      const sessionDate = new Date(booking.date);
      
      const startOfDay = new Date(sessionDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(sessionDate.setHours(23, 59, 59, 999));

      return {
          id: booking.id,
          // FIX: Akses booking.client.name sekarang benar karena tipe datanya sudah diperbaiki
          title: `[${booking.status}] ${booking.title} (${booking.client.name})`, 
          start: startOfDay,
          end: endOfDay,
          allDay: true,
          resource: { status: booking.status }
      };
  });


  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Kalender Jadwal Anda</h1>
      
      <BookingCalendar bookings={calendarEvents} />

      <div className="mt-6 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold">Catatan Penting:</h2>
        <p className="text-gray-600">Kalender saat ini menampilkan acara sebagai 'All Day' karena skema database hanya memiliki kolom `Date`.</p>
      </div>
    </div>
  );
}