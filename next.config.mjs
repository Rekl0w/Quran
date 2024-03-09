/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.islamic.network",
        port: "",
        pathname: "/quran/images/**",
      },
    ],
  },
};

export default nextConfig;
