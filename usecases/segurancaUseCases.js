const { pool } = require('../config');
const Usuario = require('../entities/usuario');

const autenticaUsuarioDB = async (body) => {
    try {
        const { email, senha } = body;
        const results = await pool.query(`SELECT * FROM USUARIOS WHERE email = $1 
            AND senha = $2`,[email, senha]);
        if (results.rowCount == 0){
            throw "Email ou senha inválidos";
        }
        const usuario = results.rows[0];
        return new Usuario(usuario.email, usuario.tipo, usuario.telefone, usuario.nome);
    } catch (err){
        throw "Erro ao autenticar o usuario: " + err;
    }
}

module.exports = { autenticaUsuarioDB };