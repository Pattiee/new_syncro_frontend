// @ts-check
const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Configure global development server proxy middlewares.
 * @param {import('express').Application} app - The Express application instance provided by Webpack Dev Server.
 * @returns {void}
 */
module.exports = function (app) {
  app.use(
    ['/auth', '/products', '/orders'],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: true,
    })
  );
};