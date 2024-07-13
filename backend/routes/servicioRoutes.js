const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas por middleware de autenticación
router.post('/', authMiddleware, servicioController.crearServicio);
router.get('/', authMiddleware, servicioController.obtenerServicios);
router.get('/:id', authMiddleware, servicioController.obtenerServicioPorId); 
router.put('/:id', authMiddleware, servicioController.actualizarServicio);
router.delete('/:id', authMiddleware, servicioController.eliminarServicio);

module.exports = router;
