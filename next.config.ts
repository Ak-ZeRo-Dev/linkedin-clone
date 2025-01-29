import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverActions: {
  //   bodySizeLimit: "20mb", // Set the limit as needed (e.g., 10 MB)
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
