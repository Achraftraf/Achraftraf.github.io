/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Commented out for development with API routes
  // output: 'export', 
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig