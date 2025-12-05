const { Router } = require('express');
const { getProjetos, addProjeto, updateProjeto, deleteProjeto, getProjetoPorCodigo } = require('../controllers/projetoController');
const { verificarAdmin } = require('../controllers/segurancaController');

const rotasProjetos = new Router();

rotasProjetos.route('/projetos')
    .get(getProjetos)
    .post(addProjeto)
    .put(updateProjeto);

rotasProjetos.route('/projetos/:codigo')
    .get(getProjetoPorCodigo)
    .delete(verificarAdmin, deleteProjeto);

module.exports = { rotasProjetos };
