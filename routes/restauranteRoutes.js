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
  