// import { withPayload } from "@payloadcms/next/withPayload";
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // Optional: Disable React Strict Mode if needed
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      // use: ['webpack-glsl-loader'],
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
  transpilePackages: ["three"],
};

export default nextConfig;

// export default withPayload(nextConfig);
