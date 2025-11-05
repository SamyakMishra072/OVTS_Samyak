/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Disable ESLint checks during production builds
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ✅ Prevent type errors from breaking builds
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["images.unsplash.com", "upload.wikimedia.org"],
  },

  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
