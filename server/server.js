// String de conexión a Mongo Atlass (MongoDB.com)
// mongodb+srv://mongo-user:mongo-pass@cluster0.weiod.mongodb.net/cafe

require('./config/config');
//require

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/index'));


// VERSIÓN ORIGINAL, FUNCIONA PERO DA ERROR DE DEPRECATED
/* const connectDB = async() => {};

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;
    console.log('Base de datos Online');
}); */

// OTRA VERSIÓN, FUNCIONA PERO DA ERROR DE DEPRECATED
/* mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cafe', {
        //useMongoClient: true
    })
    .then(() =>
        console.log('connection succesfully established'))
    .catch((err) =>
        console.error(err));

 */

// FUNCIONA Y NO DA ERROR DE DEPRECATED
const connectDB = async() => {
    await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }), (err, res) => {
        if (err) throw err;
        console.log('Base de datos Online');
    }
};

connectDB().catch(error => console.error(error));


// PARECE QUE FUNCIONA
/* const dbConfigOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

const connectDb = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/cafe', dbConfigOptions)
        console.log(`Connected to database`) // on Worker process: ${process.pid}
    } catch (error) {
        console.log(`Connection error`) //: ${error.stack} on Worker process: ${process.pid}
            //process.exit(1)
    }
};
 */


//NO SE SI FUNCIONA PORQUE NO HACE NADA 
/*  const connectDB = async() => {
    await mongoose.connect('mongodb://localhost:27017/cafe', dbConfigOptions, (err, res) => {
        if (err) {
            //throw err;
            console.log('No anda!');
        } else {
            console.log('Base de datos Online');
        }
    });
}; */


app.listen(process.env.PORT, () => {
    console.log('Listening on port ' + process.env.PORT);
    //console.log('Environment : ' + process.env.URLDB);
})