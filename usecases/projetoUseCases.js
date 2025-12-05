const { pool } = require('../config');
const Projeto = require('../entities/projeto');

const getProjetosDB = async (usuario) => {
    try {
        let query;
        let params = [];
        
        if (usuario.tipo === 'admin') {
            // Admin vê todos os projetos
            query = `
                SELECT p.*, u.nome as usuario_nome 
                FROM projetos p 
                JOIN usuarios u ON p.usuario_codigo = u.codigo
                ORDER BY p.codigo DESC
            `;
        } else {
            // Comum vê apenas seus projetos
            query = `
                SELECT p.*, u.nome as usuario_nome 
                FROM projetos p 
                JOIN usuarios u ON p.usuario_codigo = u.codigo
                WHERE p.usuario_codigo = $1
                ORDER BY p.codigo DESC
            `;
            params = [usuario.codigo];
        }
        
        const { rows } = await pool.query(query, params);
        return rows;
    } catch (err){
        throw "ERRO: " + err;
    }
}

const addProjetoDB = async (body) => {
    try {
        const { nome, descricao, usuario_codigo } = body;
        const results = await pool.query(`INSERT INTO projetos (nome, descricao, usuario_codigo)
            VALUES ($1, $2, $3) RETURNING codigo, nome, descricao, usuario_codigo, data_criacao`,
            [nome, descricao || null, usuario_codigo]);
        const p = results.rows[0];
        return new Projeto(p.codigo, p.nome, p.descricao, p.usuario_codigo, p.data_criacao);
    } catch(err){
        throw "Erro ao inserir o projeto: " + err
    }
}

const updateProjetoDB = async (body) => {
    try {
        const { codigo, nome, descricao } = body;
        const results = await pool.query(`UPDATE projetos SET nome = $1, descricao = $2
            WHERE codigo = $3 RETURNING codigo, nome, descricao, usuario_codigo, data_criacao`,
            [nome, descricao, codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        }
        const p = results.rows[0];
        return new Projeto(p.codigo, p.nome, p.descricao, p.usuario_codigo, p.data_criacao);
    } catch(err){
        throw "Erro ao alterar o projeto: " + err
    }
}

const deleteProjetoDB = async (codigo) => {
    try {
        const results = await pool.query(`DELETE FROM projetos WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            return "Projeto removido com sucesso"
        }
    } catch(err){
        throw "Erro ao remover o projeto: " + err
    }
}

const getProjetoPorCodigoDB = async (codigo, usuario_codigo) => {
    try {
        const results = await pool.query(
            `SELECT * FROM projetos WHERE codigo = $1 AND usuario_codigo = $2`,
            [codigo, usuario_codigo]
        );
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const p = results.rows[0];
            return new Projeto(p.codigo, p.nome, p.descricao, p.usuario_codigo, p.data_criacao);
        }
    } catch(err){
        throw "Erro ao recuperar o projeto: " + err
    }
}

module.exports = {
    getProjetosDB, addProjetoDB, updateProjetoDB, deleteProjetoDB, getProjetoPorCodigoDB
}
