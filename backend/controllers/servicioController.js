const Servicio = require('../models/Servicio');

// Crear servicio (POST /api/servicios)
exports.crearServicio = async (req, res) => {
    try {
        const { tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes } = req.body;
        const usuarioId = req.user.id; // Obtener el ID del usuario del token

        const nuevoServicio = new Servicio({
            tipoServicio,
            nombre,
            descripcion,
            amenidades,
            diasSemana,
            horarioDesde,
            horarioHasta,
            precioHora,
            imagenes,
            creador: usuarioId // Asignar el ID del creador
        });

        const servicioGuardado = await nuevoServicio.save();
        res.status(201).json(servicioGuardado);
    } catch (error) {
        console.error('Error al crear servicio:', error); // Registrar el error en la consola
        res.status(500).json({ mensaje: 'Error al crear el servicio' });
    }
};

// Obtener todos los servicios activos (GET /api/servicios)
exports.obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find({ estado: 1 }).populate('creador', 'username email');
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los servicios', error });
    }
};
exports.obtenerServicioPorId = async (req, res) => {
  const { id } = req.params;
  try {
      const servicio = await Servicio.findById(id);
      if (!servicio) {
          return res.status(404).json({ mensaje: 'Servicio no encontrado' });
      }
      res.status(200).json(servicio);
  } catch (error) {
      console.error('Error al obtener el servicio:', error);
      res.status(500).json({ mensaje: 'Error al obtener el servicio' });
  }
};

// Actualizar servicio por ID (PUT /api/servicios/:id)
exports.actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const { tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes } = req.body;

    try {
        const servicioActualizado = await Servicio.findByIdAndUpdate(
            id,
            { tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes },
            { new: true }
        );
        res.status(200).json(servicioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el servicio', error });
    }
};

// Eliminar servicio por ID (DELETE /api/servicios/:id)
exports.eliminarServicio = async (req, res) => {
    const { id } = req.params;

    try {
        const servicioEliminado = await Servicio.findByIdAndUpdate(
            id,
            { estado: 0 },
            { new: true }
        );
        res.status(200).json(servicioEliminado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el servicio', error });
    }
};
