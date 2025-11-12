import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude reference folders from build
    config.module.rules.push({
      test: /\.tsx?$/,
      include: (resourcePath: string) => {
        // Exclude files in reference folders
        return !resourcePath.includes('/public/Design_Ref/') &&
               !resourcePath.includes('/public/Resubable_Components_Ref/');
      },
      use: defaultLoaders.babel
    });

    // Also exclude from file watching
    if (dev) {
      config.watchOptions = {
        ignored: [
          '**/public/Design_Ref/**',
          '**/public/Resubable_Components_Ref/**'
        ]
      };
    }

    return config;
  }
};

export default nextConfig;
