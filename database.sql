-- Script SQL para criar banco de dados completo do gerenciador de tarefas

-- Tabela de usuários
CREATE TABLE usuarios (
    codigo SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'comum' CHECK (tipo IN ('comum', 'admin')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de projetos (FK para usuarios)
CREATE TABLE projetos (
    codigo SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    usuario_codigo INTEGER REFERENCES usuarios(codigo) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas (FK para projetos)
CREATE TABLE tarefas (
    codigo SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    projeto_codigo INTEGER REFERENCES projetos(codigo) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP
);

-- Tabela de pomodoros (FK para tarefas)
CREATE TABLE pomodoros (
    codigo SERIAL PRIMARY KEY,
    tarefa_codigo INTEGER REFERENCES tarefas(codigo) ON DELETE CASCADE,
    duracao_trabalho INTEGER DEFAULT 25,
    duracao_pausa INTEGER DEFAULT 5,
    ciclos_completados INTEGER DEFAULT 0,
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP
);

-- Dados de exemplo
INSERT INTO usuarios (email, senha, nome, tipo) VALUES 
('admin@email.com', '123456', 'Administrador', 'admin'),
('user@email.com', '123456', 'Usuário Teste', 'comum');

INSERT INTO projetos (nome, descricao, usuario_codigo) VALUES 
('Projeto Web', 'Desenvolvimento de aplicação web', 1),
('Projeto Mobile', 'App mobile para gerenciamento', 1),
('Projeto API', 'Backend REST API', 2);

INSERT INTO tarefas (titulo, descricao, status, prioridade, projeto_codigo) VALUES 
('Criar API REST', 'Desenvolver endpoints da API', 'em_andamento', 'alta', 1),
('Implementar autenticação', 'JWT e login', 'pendente', 'alta', 1),
('Design da interface', 'Criar mockups', 'concluida', 'media', 1),
('Configurar banco de dados', 'PostgreSQL setup', 'concluida', 'urgente', 2),
('Testes unitários', 'Criar testes para API', 'pendente', 'media', 3);
