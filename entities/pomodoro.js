class Pomodoro {
    constructor(codigo, tarefa_codigo, duracao_trabalho, duracao_pausa, ciclos_completados, data_inicio, data_fim) {
        this.codigo = codigo;
        this.tarefa_codigo = tarefa_codigo;
        this.duracao_trabalho = duracao_trabalho;
        this.duracao_pausa = duracao_pausa;
        this.ciclos_completados = ciclos_completados;
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
    }
}

module.exports = Pomodoro;
