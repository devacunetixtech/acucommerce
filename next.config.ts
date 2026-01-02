import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Optional: you can strictly scope this to your cloud name if you want
        // port: '',
        // pathname: '/<your-cloud-name>/**', 
      },
    ],
  },
};

export default nextConfig;
