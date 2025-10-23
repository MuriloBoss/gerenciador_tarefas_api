const { autenticaUsuarioDB } = require('../usecases/segurancaUseCases');
require('dotenv-safe').config();
const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    await autenticaUsuarioDB(request.body)
        .then(usuario => {
            const token = jwt.sign({usuario}, process.env.SECRET, {
                expiresIn : 300 // 5 minutos
            })
            return response.json({ auth : true, token : token});
        })
        .catch(err => response.status(401).json({auth : false, message : err}));
}

function verificarJWT (request, response, next){
    const token = request.headers['authorization'];
    if (!token){
        return response.status(401).json({auth : false, 
            message : 'Nenhum token recebido'});
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err){
            return response.status(401).json({auth : false, 
            message : 'Erro ao validar o token'});
        }
        console.log("Usuario decodificado do token: " + decoded.usuario);
        // se eu quero passar algo para a proxima requisição
        request.usuario = decoded.usuario;
        next();
    })
}

module.exports = {
    login, verificarJWT
}