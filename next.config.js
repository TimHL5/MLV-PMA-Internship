/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'tally.so'],
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig
