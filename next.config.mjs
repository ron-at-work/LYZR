/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["gsap", "motion", "@phosphor-icons/react", "three"],
  },
};

export default nextConfig;
