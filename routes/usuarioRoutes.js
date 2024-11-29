const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rotas para usuários
router.post('/usuarios', usuarioController.cadastrarUsuario);
router.put('/usuarios/:id', usuarioController.atualizarUsuario);
router.delete('/usuarios/:id', usuarioController.deletarUsuario);

// Rota para avaliação de restaurante
router.post('/restaurantes/:restauranteId/avaliar/:usuarioId', usuarioController.avaliarRestaurante);


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
  
module.exports = router;
