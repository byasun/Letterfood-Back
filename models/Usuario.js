const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      maxlength: 100,
    },
    foto: {
      type: String, // URL da foto (ou base64, se necessário)
    },
    descricao: {
      type: String,
      maxlength: 300,
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
    avaliacoes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Avaliacao', // Referência ao modelo de Avaliação
      },
    ],
  },
  {
    timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
  }
);

// Hash da senha antes de salvar:
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const bcrypt = require('bcrypt');
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);
