// app/page.tsx

import { redirect } from 'next/navigation';

// Ini sekarang adalah Server Component
export default function RootPage() {
  // Langsung arahkan pengguna ke halaman dashboard.
  redirect('/dashboard');

  // Fallback
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-xl font-medium text-gray-600">
        Mengalihkan ke Dashboard...
      </div>
    </div>
  );
}