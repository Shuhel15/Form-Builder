import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],

  allowedDevOrigins: ["10.29.124.236"],
};

export default nextConfig;