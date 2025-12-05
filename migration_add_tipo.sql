-- Script de migração para adicionar campo tipo na tabela usuarios
-- Execute este script se você já tem um banco de dados criado

-- Adicionar coluna tipo se não existir
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'comum' CHECK (tipo IN ('comum', 'admin'));

-- Atualizar usuários existentes para ter tipo 'comum' por padrão
UPDATE usuarios SET tipo = 'comum' WHERE tipo IS NULL;

-- Atualizar senhas existentes para usar bcrypt (IMPORTANTE: Execute manualmente)
-- As senhas em texto plano precisam ser re-cadastradas ou atualizadas via API
-- Exemplo de hash bcrypt para senha '123456': $2b$10$rBV2fAKw7HkV5S.5YvZ5/.vGKxJKx5qX5YvZ5/.vGKxJKx5qX5YvZ5/
