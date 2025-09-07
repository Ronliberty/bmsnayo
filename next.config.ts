import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/nayo",
  /* config options here */
};

export default nextConfig;
