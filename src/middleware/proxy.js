// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/auth', '/products', '/orders'], // Match Spring Boot business endpoints
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: true,
    }));
};