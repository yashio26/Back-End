const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const { response } = require('express')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const cookieParser = require('cookie-parser')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
const MongoStore = connectMongo.create({
    mongoUrl: 'mongodb+srv://coderhouse:coderhouse@cluster0.xhcwo.mongodb.net/iniciosesion?retryWrites=true&w=majority',
    mongoOptions: advancedOptions,
    ttl: 600
})

app.use(express.static('./public'))
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(session({
    store: MongoStore,
    secret: 'yash',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.get('/data', async (req, res) => {
    const datos = req.session.username
    res.render('bienvenida.ejs', { datos })
})
app.get('/', (req, res) => {
    res.render('inicioSesion.ejs')
});

app.post('/login', async (req, res) => {
    try {
        const username = req.body.name;
        req.session.username = username;
        res.redirect('/data');
    }
    catch (err) {
        console.log(err);
        res.send({ error: err });
    }
})

app.get('/olvidar/:nombre', (req,res) => {
    const name = req.params.nombre
    req.session.destroy( err => {
        if (err) {
            res.json({error: 'olvidar', descripcion: err})
        } else {
            res.render('sesionCerrada', {name})
        }
    })

})

const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))

/* io.on('connection', async (sockets) => {
    sockets.emit('product', await Container.getProds())
    console.log('Un cliente se ha conectado!)
    // div
    sockets.emit('messages', await Contenedor.getMsg())

    sockets.on('new-product', async data => {
        await Container.saveProd(data)
        console.log(data)
        
        io.sockets.emit('product', await Container.getProds())
    })
    sockets.on('new-message', async dato => {

        await Contenedor.saveMsj(dato)
        console.log(dato)

        io.sockets.emit('messages', await Contenedor.getMsg())
    })
}) */