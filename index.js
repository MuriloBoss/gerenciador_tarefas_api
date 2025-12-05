const express = require('express');
const cors = require('cors');
const rotas = require('./routes/rotas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

// Log de todas as requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers.authorization ? 'Token presente' : 'Sem token');
    next();
});

app.use(rotas);

app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API rodando...');
})