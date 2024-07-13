const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, config.secret);
        req.user = await User.findById(decoded.userId);
        req.userRole = decoded.role;

        // Simplified Role-Based Access Control (RBAC)
        const allowedRoles = {
            '/api/servicios': ['provider'], // Ruta protegida solo para proveedores
            '/api/servicios/:id': ['provider'],
            '/inicio-proveedor': ['provider'], // Ruta protegida solo para proveedores
            '/servicio': ['provider'], // Ruta protegida solo para proveedores
            '/modificar-perfil': ['provider'], // Ruta protegida solo para proveedores
            '/inicio-user': ['user'] // Add other protected routes here
        };

        // If the route is protected and the user doesn't have the required role, deny access
        if (allowedRoles[req.path] && !allowedRoles[req.path].includes(req.userRole)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Token no válido', details: error.message });
    }
};

module.exports = authMiddleware;
