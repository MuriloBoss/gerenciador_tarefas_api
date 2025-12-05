const { Router } = require('express');

const { rotasProjetos } = require('./rotasProjetos');
const { rotasTarefas } = require('./rotasTarefas');
const { rotasPomodoros } = require('./rotasPomodoros');
const { login, cadastrarUsuario, obterPerfil, atualizarPerfil, verificarJWT, verificarAdmin, listarUsuarios, criarUsuarioAdmin, excluirUsuario } = require('../controllers/segurancaController');

const rotas = new Router();

// Rotas públicas
rotas.route("/login").post(login);
rotas.route("/usuarios").post(cadastrarUsuario);

// Rotas protegidas
rotas.route("/usuarios/perfil")
    .get(verificarJWT, obterPerfil)
    .put(verificarJWT, atualizarPerfil);

// Rotas de admin
rotas.route("/usuarios")
    .get(verificarJWT, verificarAdmin, listarUsuarios);

rotas.route("/usuarios/admin")
    .post(verificarJWT, verificarAdmin, criarUsuarioAdmin);

rotas.route("/usuarios/:codigo")
    .delete(verificarJWT, verificarAdmin, excluirUsuario);

rotas.use(verificarJWT, rotasProjetos);
rotas.use(verificarJWT, rotasTarefas);
rotas.use(verificarJWT, rotasPomodoros);

module.exports = rotas;