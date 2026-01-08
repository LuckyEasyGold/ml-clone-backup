// src/services/auth-service.js
const axios = require('axios');
const mlConfig = require('../config/ml-config');

class AuthService {
  constructor() {
    this.clientId = mlConfig.clientId;
    this.clientSecret = mlConfig.clientSecret;
    this.redirectUri = mlConfig.redirectUri;
    this.apiUrl = mlConfig.apiUrl;
  }

  // Gera URL para login do usuário
  getAuthUrl() {
    const authUrl = `${this.apiUrl}/authorization?response_type=code` +
      `&client_id=${this.clientId}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
    
    return authUrl;
  }

  // Troca código por token de acesso
  async getAccessToken(code) {
    try {
      const response = await axios.post(`${this.apiUrl}/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter token:', error.response?.data || error.message);
      throw error;
    }
  }

  // Renova token com refresh_token
  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(`${this.apiUrl}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();