import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the development indicator in bottom-left corner
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permitir temporalmente todos para prueba, luego restringir a S3/Cloudinary
      },
    ],
  },
};

export default nextConfig;
