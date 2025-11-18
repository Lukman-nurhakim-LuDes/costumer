'use client';

import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';


const { createClient } = require('@supabase/supabase-js');



let client: any = null; 


function initializeSupabaseClient(): any | null {
    if (typeof window !== 'undefined' && !client) {
        // Ambil environment variables
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        try {
            // Kita sudah menggunakan require di atas, jadi tidak perlu require lagi di sini.
            client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
        } catch (e) {
            console.error("Supabase client initialization failed:", e);
            return null;
        }
    }
    return client;
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const client = initializeSupabaseClient();
    if (!client) {
        setMessage({ type: 'error', text: 'Kesalahan klien: Supabase tidak dapat diinisialisasi.' });
        setLoading(false);
        return;
    }

    let authResponse;
    if (isSignUp) {
      // Sign Up
      authResponse = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`, 
        },
      });
      if (authResponse.error) {
        setMessage({ type: 'error', text: authResponse.error.message });
      } else {
        setMessage({ type: 'success', text: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.' });
      }
    } else {
      // Sign In
      authResponse = await client.auth.signInWithPassword({ email, password });
      if (authResponse.error) {
        setMessage({ type: 'error', text: authResponse.error.message });
      } else {
        // Redirect manual menggunakan JS murni
        window.location.href = '/dashboard'; 
      }
    }

    setLoading(false);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
        <div className="flex justify-center mb-6">
          <LogIn className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Studio Pro'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isSignUp ? 'Daftar untuk mengelola klien Anda.' : 'Masukkan detail Anda.'}
        </p>

        {/* Message Box */}
        {message && (
          <div 
            className={`p-3 mb-4 rounded-xl text-sm font-medium ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 
              message.type === 'success' ? 'bg-green-100 text-green-700' : 
              'bg-blue-100 text-blue-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat Email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Memproses...' : (isSignUp ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        {/* Switch Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-blue-600 hover:text-blue-500 ml-2 focus:outline-none"
            disabled={loading}
          >
            {isSignUp ? 'Masuk' : 'Daftar'}
          </button>
        </p>
      </div>
    </div>
  );
}