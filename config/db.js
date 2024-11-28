const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Termina o processo em caso de falha na conexão
  }
};

// Define opções globais (opcional, mas útil em desenvolvimento)
mongoose.set('debug', process.env.NODE_ENV === 'development');

module.exports = conectarDB;
