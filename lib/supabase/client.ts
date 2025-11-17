import { createClient } from "@supabase/supabase-js";
// NOTE: Kita tidak menggunakan import statis, tapi menggunakan require 
// sebagai solusi untuk masalah bundling yang berulang.

// Variabel global untuk instance Supabase
let supabase: any; 

/**
 * Mendapatkan atau menginisialisasi Supabase Client sisi klien.
 * Menggunakan require untuk bypass error resolusi bundler.
 */
export function getClientSupabase() {
    if (typeof window !== 'undefined' && !supabase) {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        try {
            // Gunakan require untuk resolusi yang lebih andal di lingkungan bermasalah
            const { createClient } = require('@supabase/supabase-js');
            supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
        } catch (e) {
            console.error("Supabase client initialization failed (Bundler Error):", e);
            return null;
        }
    }
    return supabase;
}

// Kita menggunakan named export getClientSupabase() sebagai gantinya.