import type { NextConfig } from "next";

const images = {
  domains: [],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
};
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
