const express = require('express');
const mongoose = require('mongoose');
const usuarioRoutes = require('./routes/usuarioRoutes'); 
const Usuario = require('./models/Usuario');
const Avaliacao = require('./models/Avaliacao'); 
const Restaurante = require('./models/Restaurante');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

// Criar uma avaliação
app.post('/avaliacoes', async (req, res) => {
  try {
    const avaliacao = new Avaliacao(req.body);
    const novaAvaliacao = await avaliacao.save();
    res.status(201).json(novaAvaliacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todas as avaliações
app.get('/avaliacoes', async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find()
      .populate('restaurante', 'nome')
      .populate('usuario', 'nome');
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter uma avaliação por ID
app.get('/avaliacoes/:id', async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id)
      .populate('restaurante', 'nome')
      .populate('usuario', 'nome');
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar uma avaliação
app.put('/avaliacoes/:id', async (req, res) => {
  try {
    const avaliacaoAtualizada = await Avaliacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!avaliacaoAtualizada) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json(avaliacaoAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar uma avaliação
app.delete('/avaliacoes/:id', async (req, res) => {
  try {
    const avaliacaoDeletada = await Avaliacao.findByIdAndDelete(req.params.id);
    if (!avaliacaoDeletada) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar um restaurante
app.post('/restaurantes', async (req, res) => {
  try {
    const restaurante = new Restaurante(req.body);
    const novoRestaurante = await restaurante.save();
    res.status(201).json(novoRestaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos os restaurantes
app.get('/restaurantes', async (req, res) => {
  try {
    const restaurantes = await Restaurante.find().populate('avaliacoes');
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter um restaurante por ID
app.get('/restaurantes/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id).populate({
      path: 'avaliacoes',
      populate: { path: 'usuario', select: 'nome' },
    });
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }
    res.json(restaurante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um restaurante
app.put('/restaurantes/:id', async (req, res) => {
  try {
    const restauranteAtualizado = await Restaurante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restauranteAtualizado) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }
    res.json(restauranteAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar um restaurante
app.delete('/restaurantes/:id', async (req, res) => {
  try {
    const restauranteDeletado = await Restaurante.findByIdAndDelete(req.params.id);
    if (!restauranteDeletado) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }
    res.json({ message: 'Restaurante deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar um novo restaurante
app.post('/restaurantes/registro', async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, categoria } = req.body;

    // Verificar se o nome já está em uso
    const restauranteExistente = await Restaurante.findOne({ nome });
    if (restauranteExistente) {
      return res.status(400).json({ error: 'Nome já está em uso' });
    }

    // Verificar se o email já está em uso
    const emailExistente = await Restaurante.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Criar um novo restaurante
    const novoRestaurante = new Restaurante({
      nome,
      email,
      senha, // A senha será hashed no middleware pre-save
      telefone,
      endereco,
      categoria,
    });

    // Salvar o restaurante no banco de dados
    await novoRestaurante.save();

    // Retornar a resposta com o restaurante criado
    res.status(201).json(novoRestaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login de restaurante
app.post('/restaurantes/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o restaurante existe
    const restaurante = await Restaurante.findOne({ email });
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, restaurante.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: restaurante._id, email: restaurante.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, restaurante });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuário
app.post('/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Cadastro de usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, foto, descricao, email, senha } = req.body;

    const novoUsuario = new Usuario({ nome, foto, descricao, email, senha });
    await novoUsuario.save();

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao cadastrar o usuário', detalhes: error.message });
  }
});

// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacoes = req.body;

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, atualizacoes, { new: true });

    if (!usuarioAtualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar o usuário', detalhes: error.message });
  }
});

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeletado = await Usuario.findByIdAndDelete(id);

    if (!usuarioDeletado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao deletar o usuário', detalhes: error.message });
  }

});



module.exports = app;