// Puerto

process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED De autenticación

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.DB_URL;
}

process.env.URLDB = urlDB;

/* 
const connectDB = async() => {
    await mongoose.connect(urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }), (err, res) => {
        if (err) throw err;
        console.log('Base de datos Online');
    }
}; */