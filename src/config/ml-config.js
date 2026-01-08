// src/config/ml-config.js
require('dotenv').config();

module.exports = {
  clientId: process.env.ML_CLIENT_ID,
  clientSecret: process.env.ML_CLIENT_SECRET,
  redirectUri: process.env.ML_REDIRECT_URI,
  apiUrl: 'https://api.mercadolibre.com'
};