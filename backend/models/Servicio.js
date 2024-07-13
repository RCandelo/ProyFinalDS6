const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    tipoServicio: String,
    nombre: String,
    descripcion: String,
    amenidades: String,
    diasSemana: [String],
    horarioDesde: String,
    horarioHasta: String,
    precioHora: Number,
    imagenes: [String],
    estado: {
        type: Number,
        default: 1 // 1: activo, 0: inactivo
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Servicio', servicioSchema);
