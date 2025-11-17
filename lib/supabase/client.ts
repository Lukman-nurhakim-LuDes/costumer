// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Fungsi ini digunakan di semua komponen yang berinteraksi di sisi browser
export function createClientSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}