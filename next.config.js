/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/preventivo',
        destination: '/preventivo/list',
        permanent: false,
      },
      {
        source: '/ordine',
        destination: '/ordine/list',
        permanent: false,
      },
      {
        source: '/',
        destination: '/preventivo/list',
        permanent: false,
      },
    ]
  },
}
