const BilheteModel = require('../models/bilheteModel');

const BilhetesController = {
  async listar(req, res) {
    try {
      const bilhetes = await BilheteModel.findAll();
      res.json(bilhetes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar bilhetes' });
    }
  },

  async buscar(req, res) {
    try {
      const bilhete = await BilheteModel.findById(req.params.id);
      if (!bilhete) return res.status(404).json({ erro: 'Bilhete não encontrado' });
      res.json(bilhete);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar bilhete' });
    }
  },

  async criar(req, res) {
    try {
      const { titulo, mensagem, tipo, cor, autor, horario, itens_lista } = req.body;
      if (!titulo || !tipo || !cor || !autor) {
        return res.status(400).json({ erro: 'Campos obrigatórios: titulo, tipo, cor, autor' });
      }
      const bilhete = await BilheteModel.create({ titulo, mensagem, tipo, cor, autor, horario, itens_lista });
      res.status(201).json(bilhete);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar bilhete' });
    }
  },

  async editar(req, res) {
    try {
      const { titulo, mensagem, tipo, cor, autor, horario, itens_lista } = req.body;
      if (!titulo || !tipo || !cor || !autor) {
        return res.status(400).json({ erro: 'Campos obrigatórios: titulo, tipo, cor, autor' });
      }
      const bilhete = await BilheteModel.update(req.params.id, { titulo, mensagem, tipo, cor, autor, horario, itens_lista });
      if (!bilhete) return res.status(404).json({ erro: 'Bilhete não encontrado' });
      res.json(bilhete);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao editar bilhete' });
    }
  },

  async excluir(req, res) {
    try {
      const bilhete = await BilheteModel.delete(req.params.id);
      if (!bilhete) return res.status(404).json({ erro: 'Bilhete não encontrado' });
      res.json({ mensagem: 'Bilhete excluído com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao excluir bilhete' });
    }
  },
};

module.exports = BilhetesController;
