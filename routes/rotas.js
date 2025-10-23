const { Router } = require('express');

const { rotasProjetos } = require('./rotasProjetos');
const { rotasTarefas } = require('./rotasTarefas');
const { rotasPomodoros } = require('./rotasPomodoros');
const { login } = require('../controllers/segurancaController');

const rotas = new Router();

rotas.route("/login").post(login);

rotas.use(rotasProjetos);
rotas.use(rotasTarefas);
rotas.use(rotasPomodoros);

module.exports = rotas;