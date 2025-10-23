class Tarefa {
    constructor(codigo, titulo, descricao, status, prioridade, projeto_codigo, projeto_nome, data_criacao, data_conclusao) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.projeto_codigo = projeto_codigo;
        this.projeto_nome = projeto_nome;
        this.data_criacao = data_criacao;
        this.data_conclusao = data_conclusao;
    }
}

module.exports = Tarefa;
