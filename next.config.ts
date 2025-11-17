// next.config.js
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressive: true, // Untuk memastikan cache dimuat cepat
  reloadOnOnline: true,
  sw: 'service-worker.js',
  // disable: process.env.NODE_ENV === 'development', // Uncomment ini saat Development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Tambahkan konfigurasi Next.js lain di sini jika ada
};

module.exports = withPWA(nextConfig);