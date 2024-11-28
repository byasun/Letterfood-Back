const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
      console.log('Erro ao conectar ao MongoDB:', error);
      process.exit(1);
  }
};

mongoose.set('debug', process.env.NODE_ENV === 'development');

module.exports = conectarDB;