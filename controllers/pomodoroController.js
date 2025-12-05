const { getPomodorosDB, addPomodorooDB, updatePomodorooDB, getPomodorosPorTarefaDB } = require('../usecases/pomodoroUseCases');

const getPomodoros = async (request, response) => {
    await getPomodorosDB(request.usuario.codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar os pomodoros: ' + err
          }))
}

const addPomodoro = async (request, response) => {
    await addPomodorooDB(request.body)
          .then(data => response.status(200).json({
                "status" : "success", "message" : "Pomodoro iniciado",
                "objeto" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const updatePomodoro = async (request, response) => {
    await updatePomodorooDB(request.params.codigo, request.body.ciclos_completados)
          .then(data => response.status(200).json({
                "status" : "success", "message" : "Pomodoro finalizado",
                "objeto" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const getPomodorosPorTarefa = async (request, response) => {
    await getPomodorosPorTarefaDB(request.params.tarefa_codigo, request.usuario.codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

module.exports = {
    getPomodoros, addPomodoro, updatePomodoro, getPomodorosPorTarefa
}
