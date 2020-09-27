const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();


app.get('/usuario', function(req, res) {

    /*     if (Number(req.query.desde)) {
            let desde = req.query.desde
        } else {
            desde = 0;
        } */

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ status: true }, 'nombre email status role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }

            Usuario.countDocuments({ status: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            })

        });

});


app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dato no se pudo grabar',
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});


app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status']);

    //body.password = bcrypt.hashSync(body.password, 10);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dato no se pudo grabar',
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })



});
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['status']);

    // Funciona, borra físicamente a un usuario de la base
    /*     Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El dato no se pudo borrar',
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe en la base'
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            })

        }); */

    Usuario.findByIdAndUpdate(id, { status: false }, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe en la base (1)',
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe en la base (2)'
            });
        }

        //body.status = false;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


});



module.exports = app;