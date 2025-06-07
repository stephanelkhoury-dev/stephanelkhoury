/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
}

module.exports = nextConfig
