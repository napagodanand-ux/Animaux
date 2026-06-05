import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lngkmhxpwccfjeiwbfxe.supabase.co',
      },
    ],
  },
}

export default nextConfig
