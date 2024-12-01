const Usuario = require('../models/Usuario'); // Modelo de Usuário
const Restaurante = require('../models/Restaurante'); // Modelo de Restaurante
const Avaliacao = require('../models/Avaliacao'); // Modelo de Avaliação

// Cadastro de Usuário
const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, foto, descricao, email, senha } = req.body;

    const novoUsuario = new Usuario({ nome, foto, descricao, email, senha });
    await novoUsuario.save();

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao cadastrar o usuário', detalhes: error.message });
  }
};

// Atualizar Usuário
const atualizarUsuario = async (req, res) => {
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
};

// Deletar Usuário
const deletarUsuario = async (req, res) => {
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
};

// Avaliar Restaurante
const avaliarRestaurante = async (req, res) => {
  try {
    const { restauranteId, usuarioId } = req.params;
    const { nota, comentario } = req.body;

    // Verifica se o restaurante existe
    const restaurante = await Restaurante.findById(restauranteId);
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    // Verifica se o usuário existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Cria uma nova avaliação
    const novaAvaliacao = new Avaliacao({
      restaurante: restauranteId,
      usuario: usuarioId,
      nota,
      comentario,
    });

    await novaAvaliacao.save();

    // Atualiza as referências no restaurante e no usuário
    restaurante.avaliacoes.push(novaAvaliacao._id);
    await restaurante.save();

    usuario.avaliacoes.push(novaAvaliacao._id);
    await usuario.save();

    return res.status(201).json({ message: 'Avaliação cadastrada com sucesso!', avaliacao: novaAvaliacao });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao avaliar o restaurante', detalhes: error.message });
  }
};

// Listar todos os Usuários
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Busca todos os usuários
    return res.status(200).json(usuarios); // Retorna os usuários encontrados
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar os usuários', detalhes: error.message });
  }
};
// Exporta as funções do controlador
module.exports = {
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
  avaliarRestaurante,
  listarUsuarios, 
};