/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Disable ESLint checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable Next.js built-in image optimization (avoids sharp-related errors)
  images: {
    unoptimized: true,
  },

  // Support loading static image assets like .png/.jpg/.svg
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
