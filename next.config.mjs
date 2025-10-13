/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors. Useful to unblock CI while
    // lint issues are addressed incrementally.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'res.cloudinary.com',
      'cdnjs.cloudflare.com'
    ]
  },
};

export default nextConfig;
