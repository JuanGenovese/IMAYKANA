import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the development indicator in bottom-left corner
  devIndicators: false as any,
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
