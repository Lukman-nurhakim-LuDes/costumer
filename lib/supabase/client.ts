import { createBrowserClient } from '@supabase/ssr';
// HAPUS: import { createServerClient, type CookieOptions } from '@supabase/ssr';
// HAPUS: import { cookies } from 'next/headers';

// HANYA gunakan createBrowserClient
export function createClientSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}