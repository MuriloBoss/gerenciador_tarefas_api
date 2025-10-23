const { Router } = require('express');
const { getProjetos, addProjeto, updateProjeto, deleteProjeto, getProjetoPorCodigo } = require('../controllers/projetoController');

const rotasProjetos = new Router();

rotasProjetos.route('/projetos')
    .get(getProjetos)
    .post(addProjeto)
    .put(updateProjeto);

rotasProjetos.route('/projetos/:codigo')
    .get(getProjetoPorCodigo)
    .delete(deleteProjeto);

module.exports = { rotasProjetos };
