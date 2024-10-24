// next.config.js
const path = require('path');

module.exports = {
  output: 'standalone',
  webpack: (config) => {
   config.resolve.alias['@'] = path.resolve(__dirname, 'src');
   return config;
 },
};