/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sis/api-contracts'],
  async rewrites() {
    if (process.env.BACKEND_API_URL) {
      const backendUrl = process.env.BACKEND_API_URL.replace(/\/$/, '');
      const destination = backendUrl.endsWith('/api/v1')
        ? `${backendUrl}/:path*`
        : `${backendUrl}/api/v1/:path*`;
      return [
        {
          source: '/api/v1/:path*',
          destination,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
