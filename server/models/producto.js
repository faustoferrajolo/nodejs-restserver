const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const usuario = require('./usuario');
const categoria = require('./categoria');


const Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: categoria,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: usuario,
        required: true
    },
    img: {
        type: String,
        required: false
    }
});


module.exports = mongoose.model('Producto', productoSchema);