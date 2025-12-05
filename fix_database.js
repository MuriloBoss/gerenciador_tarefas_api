const { pool } = require('./config');

async function fixDatabase() {
    try {
        // Adicionar coluna tipo se não existir
        await pool.query(`
            ALTER TABLE usuarios 
            ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'comum' 
            CHECK (tipo IN ('comum', 'admin'))
        `);
        
        // Atualizar usuários existentes
        await pool.query(`UPDATE usuarios SET tipo = 'admin' WHERE email = 'admin@email.com'`);
        await pool.query(`UPDATE usuarios SET tipo = 'comum' WHERE tipo IS NULL`);
        
        console.log('Banco de dados corrigido com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao corrigir banco:', error);
        process.exit(1);
    }
}

fixDatabase();