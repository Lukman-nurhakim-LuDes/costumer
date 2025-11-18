'use client';

// Kita tahu Next.js bermasalah dengan date-fns default export
// Kita akan menggunakan import penuh
import * as dateFnsFormat from 'date-fns/format';
import * as dateFnsParse from 'date-fns/parse';
import * as dateFnsStartOfWeek from 'date-fns/startOfWeek';
import * as dateFnsGetDay from 'date-fns/getDay';
import { enGB } from 'date-fns/locale'; 

// Hapus import 'Event' yang menyebabkan konflik type
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';


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
    format: dateFnsFormat,
    parse: dateFnsParse,
    startOfWeek: dateFnsStartOfWeek,
    getDay: dateFnsGetDay,
    locales,
});

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
    
    // Gaya untuk event di kalender (misalnya, warna)
    // NOTE: Sekarang event menggunakan tipe BookingEvent, bukan Event bawaan
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
                events={bookings} // 🛑 PERBAIKAN: Hapus type casting. Kirim BookingEvent[] secara langsung.
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