/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const config = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/preventivo',
        destination: '/preventivo/list',
        permanent: false,
      },
    ]
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports = config
} else {
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer()
}
