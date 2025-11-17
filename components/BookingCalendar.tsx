// components/BookingCalendar.tsx
'use client';

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';
import { enGB } from 'date-fns/locale'; // Menggunakan English Great Britain untuk format standar, bisa diganti ke id jika Anda ingin kalender dalam Bahasa Indonesia

// Tipe data yang diterima dari Server Component
interface BookingEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
}

interface BookingCalendarProps {
    bookings: BookingEvent[];
}

// Konfigurasi localizer untuk date-fns
const locales = {
  'en-GB': enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
    
  // Gaya untuk event di kalender (misalnya, warna)
  const eventPropGetter = useMemo(() => (event: BookingEvent, start: Date, end: Date, isSelected: boolean) => {
    let backgroundColor = '#4f46e5'; // Indigo 600 default
    
    // Anda dapat menambahkan logika warna berdasarkan status booking di sini
    // Contoh: if (event.resource.status === 'Completed') backgroundColor = '#10b981'; 

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  }, []);

  return (
    <div className="h-[700px] p-6 bg-white rounded-2xl shadow-lg">
      <Calendar
        localizer={localizer}
        events={bookings as Event[]} // Cast ke tipe Event dari react-big-calendar
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day', 'agenda']} // Tampilan yang tersedia
        defaultView="month"
        eventPropGetter={eventPropGetter}
        // Customisasi label dan pesan ke Bahasa Indonesia
        messages={{
            allDay: 'Sepanjang Hari',
            previous: 'Mundur',
            next: 'Maju',
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            day: 'Hari',
            agenda: 'Agenda',
            date: 'Tanggal',
            time: 'Waktu',
            event: 'Acara',
            noEventsInRange: 'Tidak ada jadwal di rentang ini.',
        }}
      />
    </div>
  );
}