/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow HMR WebSocket from any local IP (localhost, 127.0.0.1, or any 192.168.x.x)
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.0.1',
    '192.168.56.1',
    '*.local',
  ],
};

export default nextConfig;
