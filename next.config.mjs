/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/compare/plain-vs-adobe-acrobat',
        destination: '/compare/plain-vs-adobe-acrobat-online',
        permanent: true,
      },
      {
        source: '/pdf-tools/learn',
        destination: '/learn',
        permanent: true,
      },
      {
        source: '/pdf-tools/learn/:path*',
        destination: '/learn/:path*',
        permanent: true,
      },
      {
        source: '/pdf-tools/compare',
        destination: '/compare',
        permanent: true,
      },
      {
        source: '/pdf-tools/compare/:path*',
        destination: '/compare/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
