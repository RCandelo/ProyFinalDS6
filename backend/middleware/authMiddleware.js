const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');
const config = require('../config');

exports.protectRoute = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado - Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.usuario = await Usuario.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Acceso no autorizado - Token inválido' });
    }
};

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
        }
        next();
    };
};
