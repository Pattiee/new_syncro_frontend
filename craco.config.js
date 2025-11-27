const CompressionPlugin = require("compression-webpack-plugin");

const compressionTest = /\.(js|css|html|svg)$/;

module.exports = {
  webpack: {
    configure: (config) => {
      const commonOptions = {
        test: compressionTest,
        threshold: 1024,
        minRatio: 0.8,
      };

      config.plugins.push(
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

      return config;
    },
  },
};
