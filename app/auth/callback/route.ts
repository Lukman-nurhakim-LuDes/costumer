// app/auth/callback/route.ts

// --- PERBAIKAN PATH IMPOR ADA DI SINI ---
// Menggunakan path relatif untuk keluar dari folder 'app'
import { createServerSupabaseClient } from '../../../lib/supabase/server';
// ----------------------------------------

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Ini adalah Route Handler (sebelumnya dikenal sebagai API Route)
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  // Jika ada kode otorisasi dari Supabase, coba tukar dengan sesi pengguna
  if (code) {
    const cookieStore = cookies();
    
    // Inisialisasi Supabase Client Server-side
    const supabase = createServerSupabaseClient();
    
    // Tukar kode otorisasi dengan sesi Supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Jika berhasil, arahkan pengguna ke dashboard utama
      // Pastikan 'origin' Anda adalah URL Netlify
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Jika gagal atau tidak ada kode, arahkan pengguna kembali ke halaman utama
  return NextResponse.redirect(`${origin}/`);
}