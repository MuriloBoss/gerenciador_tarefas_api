const { getTarefasDB, addTarefaDB, updateTarefaDB, deleteTarefaDB, getTarefaPorCodigoDB, getTarefasPorProjetoDB } = require('../usecases/tarefaUseCases');

const getTarefas = async (request, response) => {
    await getTarefasDB()
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar as tarefas: ' + err
          }))
}

const addTarefa = async (request, response) => {
    console.log('Recebendo requisição POST /tarefas:', request.body);
    await addTarefaDB(request.body)
          .then(data => {
              console.log('Tarefa criada com sucesso:', data);
              response.status(200).json({
                "status" : "success", "message" : "Tarefa criada",
                "objeto" : data
              })
          })
          .catch(err => {
              console.error('Erro ao criar tarefa:', err);
              response.status(400).json({
                status : 'error',
                message : err
              })
          })
}

const updateTarefa = async (request, response) => {
    await updateTarefaDB(request.body)
          .then(data => response.status(200).json({
                "status" : "success", "message" : "Tarefa atualizada",
                "objeto" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const deleteTarefa = async (request, response) => {
    await deleteTarefaDB(request.params.codigo)
          .then(data => response.status(200).json({
                "status" : "success", "message" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const getTarefaPorCodigo = async (request, response) => {
    await getTarefaPorCodigoDB(request.params.codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const getTarefasPorProjeto = async (request, response) => {
    await getTarefasPorProjetoDB(request.params.projeto_codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

module.exports = {
    getTarefas, addTarefa, updateTarefa, deleteTarefa, getTarefaPorCodigo, getTarefasPorProjeto
}
