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
        source: '/pdf-tools/blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/pdf-tools/blog/:path*',
        destination: '/blog/:path*',
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
      {
        source: '/verify',
        destination: '/verify-claims',
        permanent: true,
      },
      {
        source: '/pdf-tools/verify',
        destination: '/verify-claims',
        permanent: true,
      },
      {
        source: '/pdf-tools/verify-claims',
        destination: '/verify-claims',
        permanent: true,
      },
      {
        source: '/file-converters/pdf-to-word',
        destination: '/tools/pdf-to-word',
        permanent: true,
      },
      {
        source: '/file-converters/word-to-pdf',
        destination: '/tools/word-to-pdf',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
