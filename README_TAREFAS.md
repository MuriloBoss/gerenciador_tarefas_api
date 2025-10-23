# API Gerenciador de Tarefas

API REST para gerenciamento de tarefas e projetos.

## Estrutura do Banco de Dados

### 4 Tabelas com Relacionamento FK:
1. **usuarios** - Usuários do sistema
2. **projetos** - Projetos (FK para usuarios)
3. **tarefas** - Tarefas (FK para projetos)
4. **pomodoros** - Sessões Pomodoro (FK para tarefas)

## Endpoints da API

### Projetos
- `GET /projetos` - Listar todos os projetos
- `GET /projetos/:codigo` - Buscar projeto por código
- `POST /projetos` - Criar novo projeto
- `PUT /projetos` - Atualizar projeto
- `DELETE /projetos/:codigo` - Deletar projeto

### Tarefas
- `GET /tarefas` - Listar todas as tarefas
- `GET /tarefas/:codigo` - Buscar tarefa por código
- `GET /projetos/:projeto_codigo/tarefas` - Listar tarefas de um projeto
- `POST /tarefas` - Criar nova tarefa
- `PUT /tarefas` - Atualizar tarefa
- `DELETE /tarefas/:codigo` - Deletar tarefa

### Pomodoros
- `GET /pomodoros` - Listar todos os pomodoros
- `POST /pomodoros` - Iniciar novo pomodoro
- `PUT /pomodoros/:codigo` - Finalizar pomodoro
- `GET /tarefas/:tarefa_codigo/pomodoros` - Listar pomodoros de uma tarefa

## Exemplos de Requisições

### Criar Projeto
```json
POST /projetos
{
  "nome": "Meu Projeto",
  "descricao": "Descrição do projeto",
  "usuario_codigo": 1
}
```

### Criar Tarefa
```json
POST /tarefas
{
  "titulo": "Implementar feature X",
  "descricao": "Detalhes da tarefa",
  "status": "pendente",
  "prioridade": "alta",
  "projeto_codigo": 1
}
```

### Atualizar Tarefa
```json
PUT /tarefas
{
  "codigo": 1,
  "titulo": "Implementar feature X",
  "descricao": "Detalhes atualizados",
  "status": "concluida",
  "prioridade": "alta",
  "projeto_codigo": 1
}
```

### Iniciar Pomodoro
```json
POST /pomodoros
{
  "tarefa_codigo": 1,
  "duracao_trabalho": 25,
  "duracao_pausa": 5
}
```

### Finalizar Pomodoro
```json
PUT /pomodoros/1
{
  "ciclos_completados": 4
}
```

## Status Disponíveis
- `pendente`
- `em_andamento`
- `concluida`
- `cancelada`

## Prioridades Disponíveis
- `baixa`
- `media`
- `alta`
- `urgente`

## Deploy

### Backend (Render)
1. Criar novo Web Service no Render
2. Conectar repositório
3. Configurar variáveis de ambiente:
   - `DATABASE_URL` - String de conexão PostgreSQL
   - `NODE_ENV=production`
4. Deploy automático

### Frontend (Vercel)
1. Importar projeto no Vercel
2. Configurar variável `VITE_API_URL` com URL do Render
3. Deploy automático
