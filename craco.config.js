const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        // Gzip compression
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 1024,
          minRatio: 0.8,
        }),
        // Brotli compression
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { 
            level: 11, 
          },
          threshold: 1024,
          minRatio: 0.8,
        })
      );
      return webpackConfig;
    },
  },
};
