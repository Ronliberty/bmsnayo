import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
   
   productionBrowserSourceMaps: false,
  /* config options here */
};

export default nextConfig;
