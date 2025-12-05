const { autenticaUsuarioDB, cadastrarUsuarioDB, obterPerfilDB, atualizarPerfilDB, listarUsuariosDB, criarUsuarioAdminDB, excluirUsuarioDB } = require('../usecases/segurancaUseCases');
require('dotenv-safe').config();
const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    await autenticaUsuarioDB(request.body)
        .then(usuario => {
            const token = jwt.sign({usuario}, process.env.SECRET, {
                expiresIn : '24h'
            })
            return response.json({ auth : true, token : token, message: 'Login realizado com sucesso'});
        })
        .catch(err => response.status(401).json({auth : false, message : err}));
}

const cadastrarUsuario = async (request, response) => {
    await cadastrarUsuarioDB(request.body)
        .then(result => response.status(201).json(result))
        .catch(err => response.status(400).json({ status: 'error', message: err }));
}

const obterPerfil = async (request, response) => {
    try {
        console.log('Usuario do token:', request.usuario);
        const result = await obterPerfilDB(request.usuario.codigo);
        response.json(result);
    } catch (err) {
        console.error('Erro ao obter perfil:', err);
        response.status(400).json({ status: 'error', message: err });
    }
}

const atualizarPerfil = async (request, response) => {
    await atualizarPerfilDB(request.usuario.codigo, request.body)
        .then(result => response.json(result))
        .catch(err => response.status(400).json({ status: 'error', message: err }));
}

function verificarJWT (request, response, next){
    const token = request.headers['authorization']?.split(' ')[1];
    console.log('Token recebido:', token ? 'Presente' : 'Ausente');
    if (!token){
        return response.status(401).json({auth : false, 
            message : 'Token não fornecido'});
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err){
            console.error('Erro JWT:', err.message);
            return response.status(401).json({auth : false, 
            message : 'Token inválido'});
        }
        console.log('Token decodificado:', decoded);
        request.usuario = decoded.usuario;
        next();
    })
}

function verificarAdmin (request, response, next){
    if (request.usuario.tipo !== 'admin'){
        return response.status(403).json({ message : 'Acesso negado. Apenas administradores.'});
    }
    next();
}

const listarUsuarios = async (request, response) => {
    try {
        const result = await listarUsuariosDB();
        response.json(result);
    } catch (err) {
        response.status(400).json({ status: 'error', message: err });
    }
}

const criarUsuarioAdmin = async (request, response) => {
    try {
        const result = await criarUsuarioAdminDB(request.body);
        response.status(201).json(result);
    } catch (err) {
        response.status(400).json({ status: 'error', message: err });
    }
}

const excluirUsuario = async (request, response) => {
    try {
        const result = await excluirUsuarioDB(request.params.codigo);
        response.json(result);
    } catch (err) {
        response.status(400).json({ status: 'error', message: err });
    }
}

module.exports = {
    login, cadastrarUsuario, obterPerfil, atualizarPerfil, verificarJWT, verificarAdmin,
    listarUsuarios, criarUsuarioAdmin, excluirUsuario
}