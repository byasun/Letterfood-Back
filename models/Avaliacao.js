const mongoose = require('mongoose');
const { Schema } = mongoose;

const avaliacaoSchema = new Schema({
  restaurante: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurante', // Referência ao modelo de Restaurante
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Referência ao modelo de Usuário
    required: true,
  },
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comentario: {
    type: String,
    trim: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);
