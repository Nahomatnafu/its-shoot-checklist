/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Add if you're using external images
  },
  // Removed swcMinify as it's enabled by default
}

module.exports = nextConfig
