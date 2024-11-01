import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
    dangerouslyAllowSVG: true, //! TODO: Remove this line later
  },
};

export default nextConfig;
