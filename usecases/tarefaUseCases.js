const { pool } = require('../config');
const Tarefa = require('../entities/tarefa');

const getTarefasDB = async (usuario) => {
    try {
        let query;
        let params = [];
        
        if (usuario.tipo === 'admin') {
            // Admin vê todas as tarefas
            query = `
                SELECT t.*, u.nome as usuario_nome 
                FROM tarefas t 
                JOIN projetos p ON t.projeto_codigo = p.codigo
                JOIN usuarios u ON p.usuario_codigo = u.codigo
                ORDER BY t.codigo DESC
            `;
        } else {
            // Comum vê apenas suas tarefas
            query = `
                SELECT t.*, u.nome as usuario_nome 
                FROM tarefas t 
                JOIN projetos p ON t.projeto_codigo = p.codigo
                JOIN usuarios u ON p.usuario_codigo = u.codigo
                WHERE p.usuario_codigo = $1
                ORDER BY t.codigo DESC
            `;
            params = [usuario.codigo];
        }
        
        const { rows } = await pool.query(query, params);
        return rows;
    } catch (err){
        throw "ERRO: " + err;
    }
}

const addTarefaDB = async (body) => {
    try {
        const { titulo, descricao, status, prioridade, projeto_codigo } = body;
        const results = await pool.query(`INSERT INTO tarefas (titulo, descricao, status, prioridade, projeto_codigo)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [titulo, descricao || null, status || 'pendente', prioridade || 'media', projeto_codigo || null]);
        const t = results.rows[0];
        return new Tarefa(t.codigo, t.titulo, t.descricao, t.status, t.prioridade, 
            t.projeto_codigo, null, t.data_criacao, t.data_conclusao);
    } catch(err){
        throw "Erro ao inserir a tarefa: " + err
    }
}

const updateTarefaDB = async (body) => {
    try {
        const { codigo, titulo, descricao, status, prioridade, projeto_codigo } = body;
        const results = await pool.query(`UPDATE tarefas 
            SET titulo = $1, descricao = $2, status = $3, prioridade = $4, projeto_codigo = $5
            WHERE codigo = $6 RETURNING *`,
            [titulo, descricao, status, prioridade, projeto_codigo, codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        }
        const t = results.rows[0];
        return new Tarefa(t.codigo, t.titulo, t.descricao, t.status, t.prioridade, 
            t.projeto_codigo, null, t.data_criacao, t.data_conclusao);
    } catch(err){
        throw "Erro ao alterar a tarefa: " + err
    }
}

const deleteTarefaDB = async (codigo) => {
    try {
        const results = await pool.query(`DELETE FROM tarefas WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            return "Tarefa removida com sucesso"
        }
    } catch(err){
        throw "Erro ao remover a tarefa: " + err
    }
}

const getTarefaPorCodigoDB = async (codigo, usuario_codigo) => {
    try {
        const results = await pool.query(`
            SELECT t.*, p.nome as projeto_nome 
            FROM tarefas t 
            LEFT JOIN projetos p ON t.projeto_codigo = p.codigo 
            WHERE t.codigo = $1 AND p.usuario_codigo = $2`,[codigo, usuario_codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const t = results.rows[0];
            return new Tarefa(t.codigo, t.titulo, t.descricao, t.status, t.prioridade, 
                t.projeto_codigo, t.projeto_nome, t.data_criacao, t.data_conclusao);
        }
    } catch(err){
        throw "Erro ao recuperar a tarefa: " + err
    }
}

const getTarefasPorProjetoDB = async (projeto_codigo, usuario_codigo) => {
    try {
        const { rows } = await pool.query(`
            SELECT t.*, p.nome as projeto_nome 
            FROM tarefas t 
            LEFT JOIN projetos p ON t.projeto_codigo = p.codigo 
            WHERE t.projeto_codigo = $1 AND p.usuario_codigo = $2
            ORDER BY t.data_criacao DESC`,[projeto_codigo, usuario_codigo]);
        return rows.map((t) => new Tarefa(t.codigo, t.titulo, t.descricao, t.status, 
            t.prioridade, t.projeto_codigo, t.projeto_nome, t.data_criacao, t.data_conclusao));
    } catch(err){
        throw "Erro ao recuperar tarefas do projeto: " + err
    }
}

module.exports = {
    getTarefasDB, addTarefaDB, updateTarefaDB, deleteTarefaDB, 
    getTarefaPorCodigoDB, getTarefasPorProjetoDB
}
