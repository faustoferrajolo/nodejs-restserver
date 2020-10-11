const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const usuario = require('./usuario');

/* let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}; */

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerida']
    },
    status: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es requerido'],
        ref: usuario
    }
});



module.exports = mongoose.model('Categoria', categoriaSchema);