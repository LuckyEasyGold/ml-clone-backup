// src/index.js
const express = require('express');
const authService = require('./services/auth-service');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: 'API ML Clone Backup - Funcionando!',
    endpoints: {
      auth: '/auth/ml',
      callback: '/auth/callback',
      status: '/status'
    }
  });
});

// Rota para iniciar autenticação
app.get('/auth/ml', (req, res) => {
  const authUrl = authService.getAuthUrl();
  res.redirect(authUrl);
});

// Callback do Mercado Livre
app.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Código de autorização não fornecido' });
    }

    // Trocar código por token
    const tokens = await authService.getAccessToken(code);
    
    res.json({
      success: true,
      message: 'Autenticação realizada com sucesso!',
      user_id: tokens.user_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
      scope: tokens.scope
    });

  } catch (error) {
    console.error('Erro no callback:', error);
    res.status(500).json({ 
      error: 'Falha na autenticação',
      details: error.message 
    });
  }
});

// Rota de status para teste
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    auth_url: `http://localhost:${PORT}/auth/ml`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔗 Para autenticar: http://localhost:${PORT}/auth/ml`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});