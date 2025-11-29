const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { db, rowToProperty } = require('./database');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * Rota de autenticação
 */
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Retorna dados do usuário (sem a senha)
    res.json({
      username: user.username,
      name: user.name,
      role: user.role,
      authenticated: true
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para listar todas as propriedades
 */
app.get('/api/properties', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM properties').all();
    const properties = rows.map(rowToProperty);
    res.json(properties);
  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    res.status(500).json({ error: 'Erro ao buscar propriedades' });
  }
});

/**
 * Rota para buscar propriedades por município
 */
app.get('/api/properties/municipio/:municipio', (req, res) => {
  const { municipio } = req.params;

  try {
    const rows = db.prepare('SELECT * FROM properties WHERE municipio = ?').all(municipio);
    const properties = rows.map(rowToProperty);
    res.json(properties);
  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    res.status(500).json({ error: 'Erro ao buscar propriedades' });
  }
});

/**
 * Rota para buscar uma propriedade específica
 */
app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;

  try {
    const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    
    if (!row) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    const property = rowToProperty(row);
    res.json(property);
  } catch (error) {
    console.error('Erro ao buscar propriedade:', error);
    res.status(500).json({ error: 'Erro ao buscar propriedade' });
  }
});

/**
 * Rota para buscar geometria WKT de uma propriedade
 */
app.get('/api/properties/:id/geometry', (req, res) => {
  const { id } = req.params;

  try {
    const row = db.prepare('SELECT id, geometry_wkt FROM properties WHERE id = ?').get(id);
    
    if (!row) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    if (!row.geometry_wkt) {
      return res.status(404).json({ error: 'Geometria não disponível para esta propriedade' });
    }

    res.json({
      id: row.id,
      geometry_wkt: row.geometry_wkt
    });
  } catch (error) {
    console.error('Erro ao buscar geometria:', error);
    res.status(500).json({ error: 'Erro ao buscar geometria' });
  }
});

/**
 * Rota para listar municípios disponíveis
 */
app.get('/api/municipios', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT municipio FROM properties ORDER BY municipio').all();
    const municipios = rows.map((row, index) => ({
      id: row.municipio.toLowerCase(),
      nome: row.municipio
    }));
    res.json(municipios);
  } catch (error) {
    console.error('Erro ao buscar municípios:', error);
    res.status(500).json({ error: 'Erro ao buscar municípios' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando corretamente' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
});
