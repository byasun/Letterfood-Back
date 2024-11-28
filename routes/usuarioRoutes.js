const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rotas para usuários
router.post('/usuarios', usuarioController.cadastrarUsuario);
router.put('/usuarios/:id', usuarioController.atualizarUsuario);
router.delete('/usuarios/:id', usuarioController.deletarUsuario);

// Rota para avaliação de restaurante
router.post('/restaurantes/:restauranteId/avaliar/:usuarioId', usuarioController.avaliarRestaurante);

module.exports = router;
