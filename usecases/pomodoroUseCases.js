const { pool } = require('../config');
const Pomodoro = require('../entities/pomodoro');

const getPomodorosDB = async (usuario_codigo) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.*, t.titulo as tarefa_titulo, pr.nome as projeto_nome
            FROM pomodoros p
            LEFT JOIN tarefas t ON p.tarefa_codigo = t.codigo
            LEFT JOIN projetos pr ON t.projeto_codigo = pr.codigo
            WHERE pr.usuario_codigo = $1
            ORDER BY p.data_inicio DESC`, [usuario_codigo]);
        return rows;
    } catch (err){
        throw "ERRO: " + err;
    }
}

const addPomodorooDB = async (body) => {
    try {
        const { tarefa_codigo, duracao_trabalho, duracao_pausa } = body;
        const results = await pool.query(`INSERT INTO pomodoros (tarefa_codigo, duracao_trabalho, duracao_pausa)
            VALUES ($1, $2, $3) RETURNING *`,
            [tarefa_codigo, duracao_trabalho || 25, duracao_pausa || 5]);
        const p = results.rows[0];
        return new Pomodoro(p.codigo, p.tarefa_codigo, p.duracao_trabalho, p.duracao_pausa, 
            p.ciclos_completados, p.data_inicio, p.data_fim);
    } catch(err){
        throw "Erro ao inserir o pomodoro: " + err
    }
}

const updatePomodorooDB = async (codigo, ciclos) => {
    try {
        const results = await pool.query(`UPDATE pomodoros 
            SET ciclos_completados = $1, data_fim = CURRENT_TIMESTAMP
            WHERE codigo = $2 RETURNING *`, [ciclos, codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        }
        const p = results.rows[0];
        return new Pomodoro(p.codigo, p.tarefa_codigo, p.duracao_trabalho, p.duracao_pausa, 
            p.ciclos_completados, p.data_inicio, p.data_fim);
    } catch(err){
        throw "Erro ao atualizar o pomodoro: " + err
    }
}

const getPomodorosPorTarefaDB = async (tarefa_codigo, usuario_codigo) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.* FROM pomodoros p
            LEFT JOIN tarefas t ON p.tarefa_codigo = t.codigo
            LEFT JOIN projetos pr ON t.projeto_codigo = pr.codigo
            WHERE p.tarefa_codigo = $1 AND pr.usuario_codigo = $2
            ORDER BY p.data_inicio DESC`, [tarefa_codigo, usuario_codigo]);
        return rows.map((p) => new Pomodoro(p.codigo, p.tarefa_codigo, p.duracao_trabalho, 
            p.duracao_pausa, p.ciclos_completados, p.data_inicio, p.data_fim));
    } catch(err){
        throw "Erro ao recuperar pomodoros: " + err
    }
}

module.exports = {
    getPomodorosDB, addPomodorooDB, updatePomodorooDB, getPomodorosPorTarefaDB
}
