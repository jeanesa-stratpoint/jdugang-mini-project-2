import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "utfs.io", // Allow UploadThing images
        },
      ],
    },
};

export default nextConfig;
