const mongoose = require('mongoose');
const { Schema } = mongoose;

const restauranteSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  endereco: {
    rua: { type: String, required: true },
    numero: { type: Number, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
  },
  telefone: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Italiana', 'Japonesa', 'Brasileira', 'Fast Food', 'Outros'],
  },
  avaliacoes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Avaliacao', // Referência ao modelo de Avaliação
    },
  ],
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurante', restauranteSchema);
