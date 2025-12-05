const { getProjetosDB, addProjetoDB, updateProjetoDB, deleteProjetoDB, getProjetoPorCodigoDB } = require('../usecases/projetoUseCases');

const getProjetos = async (request, response) => {
    await getProjetosDB(request.usuario)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar os projetos: ' + err
          }))
}

const addProjeto = async (request, response) => {
    await addProjetoDB({...request.body, usuario_codigo: request.usuario.codigo})
          .then(data => response.status(200).json({
                "status" : "success", "message" : "Projeto criado",
                "objeto" : data
          }))
          .catch(err => response.status(400).json({
                status : 'error',
                message : err
          }))
}

const updateProjeto = async (request, response) => {
    await updateProjetoDB(request.body)
          .then(data => response.status(200).json({
                "status" : "success", "message" : "Projeto atualizado",
                "objeto" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const deleteProjeto = async (request, response) => {
    await deleteProjetoDB(request.params.codigo)
          .then(data => response.status(200).json({
                "status" : "success", "message" : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const getProjetoPorCodigo = async (request, response) => {
    await getProjetoPorCodigoDB(request.params.codigo, request.usuario.codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

module.exports = {
    getProjetos, addProjeto, updateProjeto, deleteProjeto, getProjetoPorCodigo
}
