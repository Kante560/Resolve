import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow three.js and related packages to be transpiled correctly
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Disable strict mode to avoid double-invoke issues with GSAP/Three in dev
  reactStrictMode: false,
};

export default nextConfig;
