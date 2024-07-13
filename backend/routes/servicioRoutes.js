// backend/routes/serviceRoutes.js

const express = require('express');
const Service = require('../models/Servicio');

const router = express.Router();

// Crear un nuevo servicio
router.post('/servicios', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los servicios
router.get('/servicios', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send(services);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un servicio por ID
router.get('/servicios/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un servicio por ID
router.put('/servicios/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un servicio por ID
router.delete('/servicios/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
