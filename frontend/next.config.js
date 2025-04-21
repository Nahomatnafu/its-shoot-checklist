/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This is very permissive - you might want to restrict this
      },
    ],
  },
}

module.exports = nextConfig

