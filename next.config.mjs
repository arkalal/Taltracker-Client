/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure environment variables are properly loaded
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },

  // Optimize for server components
  reactStrictMode: true,

  // Enable experimental features for NextAuth v5 beta
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    serverActions: true,
  },
};

export default nextConfig;
