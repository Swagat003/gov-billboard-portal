/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // Alternative: use domains for specific hosts
    // domains: ['example.com', 'another-domain.com'],
  },
};

export default nextConfig;
