/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // For static site deployment on Netlify
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with static hosting
}

module.exports = nextConfig