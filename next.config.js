/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Forces static HTML export
    images: {
        unoptimized: true // Required for static export (Next.js Image component fix)
    }
};

module.exports = nextConfig;
