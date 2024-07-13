// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const config = require('../config/config');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando usuario', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Basic input validation (add more as needed)
      if (!email || !password) {
          return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' }); 
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta' }); 
      }

      // More secure token generation 
      const tokenPayload = { userId: user._id, role: user.role };
      const token = jwt.sign(tokenPayload, config.secret, { expiresIn: '1h' });

      // HttpOnly cookie for security (add Secure in production)
      res.cookie('token', token, { httpOnly: true }); 

      res.json({ message: 'Inicio de sesión exitoso', token, role: user.role });
  } catch (error) {
      res.status(500).json({ error: 'Error iniciando sesión', details: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Cierre de sesión exitoso' });
};

exports.checkSession = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ loggedIn: false });
    }

    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.json({ loggedIn: false });
    }

    res.json({ loggedIn: true, username: user.username });
  } catch (error) {
    res.json({ loggedIn: false });
  }
};
