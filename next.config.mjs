/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  // Ensure we can export if needed, though API routes require a server (Vercel)
  // images: { unoptimized: true }, 
};

export default nextConfig;