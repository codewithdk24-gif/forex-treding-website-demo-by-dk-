/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for blocked cross-origin request to Next.js dev resource /_next/webpack-hmr
  allowedDevOrigins: ['localhost:3000', '192.168.56.1:3000', '127.0.0.1:3000'],
};

export default nextConfig;
