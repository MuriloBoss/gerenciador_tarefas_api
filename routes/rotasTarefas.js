const { Router } = require('express');
const { getTarefas, addTarefa, updateTarefa, deleteTarefa, getTarefaPorCodigo, getTarefasPorProjeto } = require('../controllers/tarefaController');
const { verificarAdmin } = require('../controllers/segurancaController');

const rotasTarefas = new Router();

rotasTarefas.route('/tarefas')
    .get(getTarefas)
    .post(addTarefa)
    .put(updateTarefa);

rotasTarefas.route('/tarefas/:codigo')
    .get(getTarefaPorCodigo)
    .delete(deleteTarefa);

rotasTarefas.route('/projetos/:projeto_codigo/tarefas')
    .get(getTarefasPorProjeto);

module.exports = { rotasTarefas };
