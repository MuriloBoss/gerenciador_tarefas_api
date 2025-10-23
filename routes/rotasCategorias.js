const { Router } = require('express');

const { getCategorias, addCategoria, updateCategoria, 
    deleteCategoria, getCategoriaPorCodigo } = require('../controllers/categoriaController');

const { verificarJWT } = require('../controllers/segurancaController');

const rotasCategorias = new Router();

rotasCategorias.route('/categoria')
               .get(verificarJWT, getCategorias)
               .post(verificarJWT, addCategoria)
               .put(verificarJWT, updateCategoria)

rotasCategorias.route('/categoria/:codigo')
               .get(verificarJWT, getCategoriaPorCodigo)
               .delete(verificarJWT, deleteCategoria)

module.exports = { rotasCategorias }