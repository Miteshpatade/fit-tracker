/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_API: process.env.NEXT_PUBLIC_BACKEND_API,
  },
};

console.log("🔍 Loaded API URL:", process.env.NEXT_PUBLIC_BACKEND_API); // Debugging

module.exports = nextConfig;
