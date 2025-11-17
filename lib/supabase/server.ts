// lib/supabase/server.ts (Implementasi yang dimodifikasi)
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Tetap impor ini

export function createServerSupabaseClient() {
  // ❌ Hapus: const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // 🟢 Gunakan cookies() secara langsung di sini
          return cookies().get(name)?.value; 
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // 🟢 Gunakan cookies().set secara langsung
            cookies().set({ name, value, ...options }); 
          } catch (error) {
            // Error ini diabaikan
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // 🟢 Gunakan cookies().set secara langsung untuk menghapus
            cookies().set({ name, value: '', ...options }); 
          } catch (error) {
            // Error ini diabaikan
          }
        },
      },
    }
  );
}