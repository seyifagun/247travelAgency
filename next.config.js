const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  env: {
    NEXT_WAKANOW_PUBLIC_URL: "https://wakanow-images.azureedge.net",
  },
  compress: true,
  distDir: "build",
  reactStrictMode: true,
  staticPageGenerationTimeout: 3000,
  images: {
    domains: ["wakanow-images.azureedge.net", "blog.247travels.com", "plus.unsplash.com"],
  },
});
