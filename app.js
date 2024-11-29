const express = require('express');
const mongoose = require('mongoose');
const usuarioRoutes = require('./routes/usuarioRoutes'); // Rotas de usuários e avaliações
const { addUser, getUsers } = require('./models/Usuario.js');
require('dotenv').config({path: './mongoURI.env'});

const app = express();
const uri = process.env.DATABASE_URI;

// Middleware para parsing de JSON
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Rotas
app.use('/api', usuarioRoutes);

// Rota padrão para checar o status do servidor
app.get('/', (req, res) => {
  res.send('API de Usuários e Avaliações funcionando!');
});


module.exports = app;
