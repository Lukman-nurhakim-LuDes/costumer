// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
// 1. Hapus: import { cookies } from 'next/headers';

// 2. Ganti dengan require untuk mengatasi error bundling Webpack
// @ts-ignore digunakan untuk mengabaikan peringatan TypeScript terkait penggunaan require
// @ts-ignore 
const { cookies } = require('next/headers');

export function createServerSupabaseClient() {
  // const cookieStore = cookies(); // Tidak perlu lagi jika menggunakan require

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Panggil cookies() secara langsung
          return cookies().get(name)?.value;
        },
        // Metode set/remove diperlukan untuk Server Action, tapi diabaikan di Server Component
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Panggil cookies().set secara langsung
            cookies().set({ name, value, ...options });
          } catch (error) {
            // Error ini diabaikan karena terjadi saat mencoba set cookie di Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Panggil cookies().set secara langsung untuk menghapus
            cookies().set({ name, value: '', ...options });
          } catch (error) {
            // Error ini diabaikan
          }
        },
      },
    }
  );
}