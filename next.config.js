/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  // Optional: Add any other configuration you might need
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  // Enable server actions (if needed)
  // experimental: {
  //   serverActions: true,
  // },
}

module.exports = nextConfig
