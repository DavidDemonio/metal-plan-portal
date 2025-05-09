
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:8080',
  credentials: true
}));

// Variables de configuración
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'metal_scale_secret_key';

// Conexión a la base de datos
let db;

const initializeDatabase = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'metalscale'
    });
    
    console.log('Conexión a MySQL establecida');
    
    // Crear tablas si no existen
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cpu INT NOT NULL,
        ram INT NOT NULL,
        storage INT NOT NULL,
        backups INT NOT NULL,
        description TEXT,
        features JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Tablas verificadas/creadas correctamente');
  } catch (error) {
    console.error('Error al conectar con MySQL:', error);
    process.exit(1);
  }
};

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado' });
  }
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rutas de API
app.get('/api/auth/check-setup', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM users');
    const isFirstTime = rows[0].count === 0;
    res.json({ isFirstTime });
  } catch (error) {
    console.error('Error al verificar configuración:', error);
    res.status(500).json({ error: 'Error al verificar configuración' });
  }
});

app.post('/api/auth/setup', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Verificar si ya existe un usuario
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM users');
    if (rows[0].count > 0) {
      return res.status(403).json({ error: 'Ya existe un administrador' });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Guardar usuario
    await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    // Generar token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ message: 'Administrador creado correctamente', token });
  } catch (error) {
    console.error('Error en configuración inicial:', error);
    res.status(500).json({ error: 'Error en configuración inicial' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ username: req.user.username });
});

// Rutas para planes
app.get('/api/plans', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM plans ORDER BY price');
    
    // Convertir las características JSON a arrays
    const plans = rows.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : []
    }));
    
    res.json(plans);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
});

app.post('/api/plans', authenticateToken, async (req, res) => {
  const { name, price, cpu, ram, storage, backups, description, features } = req.body;
  
  if (!name || price === undefined || cpu === undefined || ram === undefined || storage === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const [result] = await db.execute(
      'INSERT INTO plans (name, price, cpu, ram, storage, backups, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, cpu, ram, storage, backups || 0, description || '', features ? JSON.stringify(features) : null]
    );
    
    const [rows] = await db.execute('SELECT * FROM plans WHERE id = ?', [result.insertId]);
    
    // Convertir las características JSON a array
    const plan = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };
    
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ error: 'Error al crear plan' });
  }
});

app.put('/api/plans/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, cpu, ram, storage, backups, description, features } = req.body;
  
  if (!name || price === undefined || cpu === undefined || ram === undefined || storage === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    await db.execute(
      'UPDATE plans SET name = ?, price = ?, cpu = ?, ram = ?, storage = ?, backups = ?, description = ?, features = ? WHERE id = ?',
      [name, price, cpu, ram, storage, backups || 0, description || '', features ? JSON.stringify(features) : null, id]
    );
    
    const [rows] = await db.execute('SELECT * FROM plans WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    
    // Convertir las características JSON a array
    const plan = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };
    
    res.json(plan);
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ error: 'Error al actualizar plan' });
  }
});

app.delete('/api/plans/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.execute('DELETE FROM plans WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    
    res.json({ message: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ error: 'Error al eliminar plan' });
  }
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Iniciar servidor
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
};

startServer();
