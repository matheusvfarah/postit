const express = require('express');
const router = express.Router();
const BilhetesController = require('../controllers/bilhetesController');

router.get('/', BilhetesController.listar);
router.get('/:id', BilhetesController.buscar);
router.post('/', BilhetesController.criar);
router.put('/:id', BilhetesController.editar);
router.delete('/:id', BilhetesController.excluir);

module.exports = router;
