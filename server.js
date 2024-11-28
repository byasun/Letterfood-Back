const app = require('./app');
const http = require('http');

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Criação do servidor HTTP
const server = http.createServer(app);

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
