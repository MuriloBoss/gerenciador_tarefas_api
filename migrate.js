const { pool } = require('./config');
const bcrypt = require('bcrypt');

async function runMigrations() {
    try {
        console.log('Executando migrations...');
        
        // 1. Criar todas as tabelas
        console.log('1. Criando tabelas...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                codigo SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                nome VARCHAR(100) NOT NULL,
                tipo VARCHAR(20) DEFAULT 'comum' CHECK (tipo IN ('comum', 'admin')),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS projetos (
                codigo SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                descricao TEXT,
                usuario_codigo INTEGER REFERENCES usuarios(codigo) ON DELETE CASCADE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tarefas (
                codigo SERIAL PRIMARY KEY,
                titulo VARCHAR(200) NOT NULL,
                descricao TEXT,
                status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
                prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
                projeto_codigo INTEGER REFERENCES projetos(codigo) ON DELETE CASCADE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_conclusao TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pomodoros (
                codigo SERIAL PRIMARY KEY,
                tarefa_codigo INTEGER REFERENCES tarefas(codigo) ON DELETE CASCADE,
                duracao_trabalho INTEGER DEFAULT 25,
                duracao_pausa INTEGER DEFAULT 5,
                ciclos_completados INTEGER DEFAULT 0,
                data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_fim TIMESTAMP
            );
        `);

        // 2. Adicionar coluna tipo se não existir (migration)
        console.log('2. Aplicando migration da coluna tipo...');
        await pool.query(`
            ALTER TABLE usuarios 
            ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'comum' 
            CHECK (tipo IN ('comum', 'admin'))
        `);

        // 3. Criar usuário admin com senha criptografada
        console.log('3. Criando usuário admin...');
        const senhaHash = await bcrypt.hash('123456', 10);
        
        await pool.query(`
            INSERT INTO usuarios (email, senha, nome, tipo) 
            VALUES ('admin@email.com', $1, 'Administrador', 'admin')
            ON CONFLICT (email) DO UPDATE SET 
            senha = $1, tipo = 'admin'
        `, [senhaHash]);

        console.log('✅ Migrations executadas com sucesso!');
        console.log('Login: admin@email.com / Senha: 123456');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao executar migrations:', error);
        process.exit(1);
    }
}

runMigrations();