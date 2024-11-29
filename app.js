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
      .populate('restaurante', 'nome') // Popula o nome do restaurante
      .populate('usuario', 'nome'); // Popula o nome do usuário
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
      populate: { path: 'usuario', select: 'nome' }, // Popula o usuário das avaliações
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


// Registrar um novo usuário
app.post('/usuarios/registro', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    const novoUsuario = await usuario.save();
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('avaliacoes');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter um usuário por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('avaliacoes');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = app;
