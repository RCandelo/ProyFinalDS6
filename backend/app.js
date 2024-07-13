// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const config = require('./config/config');
const { connectToDatabase } = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const servicioRoutes = require('./routes/servicioRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser()); // Habilita cookie-parser
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas estáticas
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/login.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/registro.html'));
});

app.get('/inicio-proveedor', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/inicio-proveedor.html'));
});

app.get('/agregar-servicio', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/addServices.html'));
});

app.get('/inicio-user', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/moduleshtml/inicio-user.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Conectar a la base de datos
connectToDatabase();
app.use('/api/servicios', servicioRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
