const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const app = express();


// ===============================
// Muestra todas las categorías
// ===============================

app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({}) //({ status: true }, 'descripcion status ')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }

            Categoria.countDocuments({ status: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    categoria,
                    conteo
                })

            })

        });

});


// ===============================
// Muestra las categorías por id
// ===============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.find(id) //(id, 'descripcion status')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existen categorías creadas',
                    err
                });
            }


            res.json({
                ok: true,
                categoria

            })

        });

});


// ===============================
// Crea nueva categoría
// ===============================

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        status: body.status,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Categoría existente o no se pudo grabar',
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoría no se pudo crear',
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});


// ===============================
// Edita categoría por id
// ===============================

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'status']);


    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'La categoría no se pudo actualizar',
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoría no se pudo actualizar',
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});


// ===============================
// Borra categoría por id
// ===============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['status']);


    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El categoría no existe en la base'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


});


module.exports = app;