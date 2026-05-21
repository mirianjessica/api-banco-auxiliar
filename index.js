const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com o banco de dados do Render
// O process.env.DATABASE_URL vai receber a URL externa do seu banco de dados automaticamente mais tarde
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obrigatório para conexões seguras no Render
  }
});

app.use(express.json());

// Rota base para testar se a API está viva
app.get('/', (req, res) => {
  res.json({ mensagem: "API Auxiliar do Sistema Bancário AS400 ativa!" });
});

// 1. Rota para Listar todos os Usuários (GET /api/usuarios)
app.get('/api/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuários no banco de dados" });
  }
});

// 2. Rota para Buscar Usuário por ID (GET /api/usuarios/:id)
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuário por ID" });
  }
});

// 3. Rota para Listar todas as Contas (GET /api/contas)
app.get('/api/contas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM contas');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar contas" });
  }
});

// 4. Rota para Listar todas as Transações (GET /api/transacao)
app.get('/api/transacao', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM transacao');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar transações" });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando com sucesso na porta ${port}`);
});