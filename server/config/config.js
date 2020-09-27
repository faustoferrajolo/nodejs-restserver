// Puerto

process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://mongo-user:mongo-pass@cluster0.weiod.mongodb.net/cafe';
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