const pool = require('../database/connection');

const BilheteModel = {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM bilhetes ORDER BY criado_em DESC'
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM bilhetes WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create({ titulo, mensagem, tipo, cor, autor, horario, itens_lista }) {
    const result = await pool.query(
      `INSERT INTO bilhetes (titulo, mensagem, tipo, cor, autor, horario, itens_lista)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        titulo,
        mensagem || null,
        tipo,
        cor,
        autor,
        horario || null,
        itens_lista ? JSON.stringify(itens_lista) : null,
      ]
    );
    return result.rows[0];
  },

  async update(id, { titulo, mensagem, tipo, cor, autor, horario, itens_lista }) {
    const result = await pool.query(
      `UPDATE bilhetes
       SET titulo = $1, mensagem = $2, tipo = $3, cor = $4, autor = $5, horario = $6, itens_lista = $7
       WHERE id = $8
       RETURNING *`,
      [
        titulo,
        mensagem || null,
        tipo,
        cor,
        autor,
        horario || null,
        itens_lista ? JSON.stringify(itens_lista) : null,
        id,
      ]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM bilhetes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = BilheteModel;
