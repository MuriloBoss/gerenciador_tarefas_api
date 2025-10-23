const { Router } = require('express');
const { getPomodoros, addPomodoro, updatePomodoro, getPomodorosPorTarefa } = require('../controllers/pomodoroController');

const rotasPomodoros = new Router();

rotasPomodoros.route('/pomodoros')
    .get(getPomodoros)
    .post(addPomodoro);

rotasPomodoros.route('/pomodoros/:codigo')
    .put(updatePomodoro);

rotasPomodoros.route('/tarefas/:tarefa_codigo/pomodoros')
    .get(getPomodorosPorTarefa);

module.exports = { rotasPomodoros };
