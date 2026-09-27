// @ts-check
const CompressionPlugin = require("compression-webpack-plugin");

/** @type {RegExp} */
const compressionTest = /\.(js|css|html|svg)$/;

// 🛠️ FIX: Cast using a composite utility profile shape to perfectly bypass the CRACO export mapping issues
/** @type {{ webpack?: { configure?: (config: import('webpack').Configuration) => import('webpack').Configuration } }} */
const config = {
  webpack: {
    configure: (webpackConfig) => {
      const commonOptions = {
        test: compressionTest,
        threshold: 1024,
        minRatio: 0.8,
      };

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new CompressionPlugin({
          ...commonOptions,
          filename: "[path][base].gz",
          algorithm: "gzip",
        }),
        new CompressionPlugin({
          ...commonOptions,
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          compressionOptions: { level: 11 },
        })
      );

      return webpackConfig;
    },
  },
};

module.exports = config;