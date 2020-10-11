const express = require('express');
const _ = require('underscore');

const Producto = require('../models/producto');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const app = express();

// ===============================
// Muestra todos los productos
// ===============================

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .skip(desde)
        .limit(limite)
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    producto,
                    conteo
                })

            })

        });

});

// ===============================
// Muestra un producto por id
// ===============================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existen productos creados',
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })

        });
});



// ===============================
// Buscar producto
// ===============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion usuario')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existen productos creados',
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })

        });
});
// ===============================
// Crea nuevo producto
// ===============================

app.post('/producto', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Producto existente o no se pudo grabar',
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto no se pudo crear',
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        })
    });

});


// ===============================
// Edita producto por id
// ===============================

app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'disponible', 'descripcion', 'precioUni', 'categoria']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El producto no se pudo actualizar',
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontró el producto',
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});


// ===============================
// Borra producto por id
// ===============================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['disponible']);

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto no existe en la base'
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        })
    })

});


module.exports = app;