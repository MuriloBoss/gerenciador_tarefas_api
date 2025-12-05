const { pool } = require('../config');
const Usuario = require('../entities/usuario');
const bcrypt = require('bcrypt');

const autenticaUsuarioDB = async (body) => {
    try {
        const { email, senha } = body;
        const results = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        if (results.rowCount == 0){
            throw "Credenciais inválidas";
        }
        const usuario = results.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida){
            throw "Credenciais inválidas";
        }
        return new Usuario(usuario.codigo, usuario.nome, usuario.email, usuario.tipo);
    } catch (err){
        throw "Credenciais inválidas";
    }
}

const cadastrarUsuarioDB = async (body) => {
    try {
        const { nome, email, senha, tipo = 'comum' } = body;
        const senhaHash = await bcrypt.hash(senha, 10);
        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)`,
            [nome, email, senhaHash, tipo]
        );
        return { status: 'success', message: 'Usuário cadastrado com sucesso' };
    } catch (err){
        if (err.code === '23505') {
            throw "Email já cadastrado";
        }
        throw "Erro ao cadastrar usuário";
    }
}

const obterPerfilDB = async (codigo) => {
    try {
        console.log('Buscando usuário com código:', codigo);
        const results = await pool.query(
            `SELECT codigo, nome, email, tipo FROM usuarios WHERE codigo = $1`,
            [codigo]
        );
        console.log('Resultado da query:', results.rowCount, 'linhas');
        if (results.rowCount == 0){
            throw "Usuário não encontrado";
        }
        const usuario = results.rows[0];
        console.log('Usuário encontrado:', usuario);
        return { status: 'success', usuario };
    } catch (err){
        console.error('Erro detalhado no obterPerfilDB:', err);
        throw "Erro ao obter perfil";
    }
}

const atualizarPerfilDB = async (codigo, body) => {
    try {
        const { nome, email, senha } = body;
        if (senha) {
            const senhaHash = await bcrypt.hash(senha, 10);
            await pool.query(
                `UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE codigo = $4`,
                [nome, email, senhaHash, codigo]
            );
        } else {
            await pool.query(
                `UPDATE usuarios SET nome = $1, email = $2 WHERE codigo = $3`,
                [nome, email, codigo]
            );
        }
        return { status: 'success', message: 'Perfil atualizado com sucesso' };
    } catch (err){
        if (err.code === '23505') {
            throw "Email já cadastrado";
        }
        throw "Erro ao atualizar perfil";
    }
}

const listarUsuariosDB = async () => {
    try {
        const results = await pool.query(
            `SELECT codigo, nome, email, tipo FROM usuarios ORDER BY codigo`
        );
        return { status: 'success', usuarios: results.rows };
    } catch (err){
        throw "Erro ao listar usuários";
    }
}

const criarUsuarioAdminDB = async (body) => {
    try {
        const { nome, email, senha, tipo } = body;
        const senhaHash = await bcrypt.hash(senha, 10);
        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)`,
            [nome, email, senhaHash, tipo]
        );
        return { status: 'success', message: 'Usuário criado com sucesso' };
    } catch (err){
        if (err.code === '23505') {
            throw "Email já cadastrado";
        }
        throw "Erro ao criar usuário";
    }
}

const excluirUsuarioDB = async (codigo) => {
    try {
        const result = await pool.query(
            `DELETE FROM usuarios WHERE codigo = $1`,
            [codigo]
        );
        if (result.rowCount === 0) {
            throw "Usuário não encontrado";
        }
        return { status: 'success', message: 'Usuário excluído com sucesso' };
    } catch (err){
        throw "Erro ao excluir usuário";
    }
}

module.exports = { 
    autenticaUsuarioDB, 
    cadastrarUsuarioDB, 
    obterPerfilDB, 
    atualizarPerfilDB,
    listarUsuariosDB,
    criarUsuarioAdminDB,
    excluirUsuarioDB
};