/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cloudflare-ipfs.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com',
    'firebasestorage.googleapis.com', 'media.tenor.com'],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig
