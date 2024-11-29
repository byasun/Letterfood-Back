const mongoose = require('mongoose');
const { Schema } = mongoose;

const restauranteSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'O nome do restaurante é obrigatório'],
    maxlength: 100,
    unique: true, // Adicionando unicidade ao nome
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
  email: {
    type: String,
    unique: true,
    required: [true, 'O email é obrigatório'],
    match: [/\S+@\S+\.\S+/, 'O formato do email é inválido'],
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
  },
  // Outros campos específicos para o restaurante podem ser adicionados aqui
},
{
  timestamps: true,
});

// Hash da senha antes de salvar
restauranteSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const bcrypt = require('bcrypt');
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

module.exports = mongoose.model('Restaurante', restauranteSchema);