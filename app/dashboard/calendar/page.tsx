// app/dashboard/calendar/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import BookingCalendar from '@/components/BookingCalendar';

// Tipe data untuk event kalender
interface BookingEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
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
          date: true, // Tanggal sesi
          client: { select: { name: true } },
          status: true,
      },
  });

  // 2. Transformasi data ke format yang dibutuhkan Kalender
  const calendarEvents: BookingEvent[] = rawBookings.map(booking => {
      // Asumsi: Semua pemesanan saat ini adalah acara sehari penuh (All Day) 
      // karena Anda hanya menyimpan kolom 'date' tanpa waktu.
      // Untuk event yang memiliki waktu (misal 09:00 - 11:00), kolom 'date' harus diubah menjadi 'start_datetime'
      
      const sessionDate = new Date(booking.date);
      
      // Karena kita hanya punya tanggal, kita anggap event dimulai pada jam 00:00 dan berakhir di 23:59
      const startOfDay = new Date(sessionDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(sessionDate.setHours(23, 59, 59, 999));

      return {
          id: booking.id,
          title: `[${booking.status}] ${booking.title} (${booking.client.name})`,
          start: startOfDay,
          end: endOfDay,
          allDay: true,
          resource: { status: booking.status } // Data tambahan jika diperlukan
      };
  });


  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Kalender Jadwal Anda</h1>
      
      <BookingCalendar bookings={calendarEvents} />

      <div className="mt-6 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold">Catatan Penting:</h2>
        <p className="text-gray-600">Kalender saat ini menampilkan acara sebagai 'All Day' karena skema database hanya memiliki kolom `Date`. Untuk waktu yang lebih spesifik, skema `Booking` perlu diubah menjadi `start_datetime` dan `end_datetime`.</p>
      </div>
    </div>
  );
}