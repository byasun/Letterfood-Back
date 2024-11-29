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