const { Router } = require('express');

const {  getProdutos, addProduto, updateProduto, deleteProduto, getProdutoPorCodigo } = require('../controllers/produtoController');

const { verificarJWT } = require('../controllers/segurancaController');

const rotasProdutos = new Router();

rotasProdutos.route('/produto')
   .get(verificarJWT, getProdutos)
   .post(verificarJWT, addProduto)
   .put(verificarJWT, updateProduto)

rotasProdutos.route('/produto/:codigo')
   .get(verificarJWT, getProdutoPorCodigo)
   .delete(verificarJWT, deleteProduto)

module.exports = { rotasProdutos };