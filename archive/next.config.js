/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost", "127.0.0.1", process.env["NEXT_PUBLIC_R2_DOMAIN"]],
  },
};

module.exports = nextConfig;
