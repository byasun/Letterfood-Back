const mongoose = require('mongoose');
require('dotenv').config({path: './mongoURI.env'});

const uri = process.env.DATABASE_URI;

const conectarDB = async () => {
  try {
    await mongoose.connect(uri, {});
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Termina o processo em caso de falha na conexão
  }
};

// Define opções globais (opcional, mas útil em desenvolvimento)
mongoose.set('debug', process.env.NODE_ENV === 'development');

module.exports = conectarDB;
