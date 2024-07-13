const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const config = require('./config/config');
const { connectToDatabase } = require('./config/db');

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/login.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/registro.html'));
});

connectToDatabase();

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
