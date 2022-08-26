import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
import { response } from 'express'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import cookieParser from 'cookie-parser'
import normalizer from './utils/normalizr.js'
/*  */
import ContainerUsers from './containers/containerUsers.js'
const listaDeUsuarios = new ContainerUsers;
import ContenedorMensajes from './containers/contenedorMensajes.js'
const historialDeMensajes = new ContenedorMensajes;
import ContenedorProductos from './containers/contenedorProductos.js'
const listaDeProductos = new ContenedorProductos;
import ContenedorCarrito from './containers/contenedorCarritoMongo.js'
const productosEnCarrito = new ContenedorCarrito;
import ContainerPurchases from './containers/containerPurchases.js'
const listaDeCompras = new ContainerPurchases;
/*  */
import passport from 'passport'
import LocalStrategy from 'passport-local'
import dotenv from 'dotenv/config'
import parseArgs from 'yargs/yargs'
import { fork } from 'child_process'
import path from 'path'
import { async } from '@firebase/util'

const PORT = process.env.PORT || 8080

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
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

const sessionCart = [
    {
        id: '1',
        nombre: 'Producto 1',
        precio: 100,
        cantidad: 1
    }
];


passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
        const usuario = await listaDeUsuarios.getUserByUsername(username)
        if (usuario) {
            return done(null, false)
        }
        const user = {
            username,
            password,
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            age: req.body.age,
            phone: req.body.phone,
            avatar: req.body.avatar
        }
        const newUser = await listaDeUsuarios.saveUser(user)
        console.log('newUser es', newUser)
        productosEnCarrito.saveCarrito(newUser)
        console.log('Usuario creado')
        return done(null, user)
    }
))

passport.use('login', new LocalStrategy( async (username, password, done) => {
    const user = await listaDeUsuarios.getUserByUsername(username)
    if (!user) {
        return done(null, false, { message: 'Usuario no existe' })
    }
    if (user.password !== password) {
        return done(null, false, { message: 'Contraseña incorrecta' })
    }
    console.log('Usuario autenticado')
    return done(null, user)
}))

passport.serializeUser(function (user, done) {
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    const usuario = listaDeUsuarios.getUserByUsername(username)
    done(null, usuario)
})



app.use(passport.initialize())
app.use(passport.session())



function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('No iniciaste sesion')
    res.redirect('/iniciosesion')
}



/* REGISTRO */

app.get('/registro', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else{
        res.render('registro.ejs')
    }
})

app.post('/registro', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/error-registro'
}))

app.get('/error-registro', (req, res) => {
    res.render('errorRegistro.ejs')
})

/* INICIO SESION */

app.get('/iniciosesion', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else{
        res.render('inicioSesion.ejs')
    }
})

app.post('/iniciosesion', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/error-inicio-sesion'
}))

app.get('/error-inicio-sesion', (req, res) => {
    res.render('errorInicioSesion.ejs')
})

/* COMERCIO */

app.get('/', isAuth, (req, res) => {
    const username = req.session.passport.user
    res.render('bienvenida.ejs', { username, carrito: sessionCart })
})

/* DATOS PERSONALES */

app.get('/datos-personales', isAuth, async (req, res) => {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    res.render('datosPersonales.ejs', { informacion })
})

/* CERRAR SESION */

app.get('/sesioncerrada', (req, res) => {
    req.logout(err => {
        req.session.destroy(err => {
            res.redirect('/iniciosesion')
        })
    })
})


/* CARRITO */

app.get('/carrito', isAuth, async (req, res) => {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const carrito = await productosEnCarrito.getCartByUserId(informacion.id)
    res.render('carrito.ejs', { productos: carrito.productos,  idCarrito: carrito.idUsuario })
})

/* AGREGAR PRODUCTO A CARRITO */

app.post('/agregar/:idProducto', isAuth, async (req, res) => {
    const idProducto = req.params.idProducto
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const productoParaAgregarACarrito = await listaDeProductos.getProdById(idProducto)
    const carritoActualizado = await productosEnCarrito.saveProductInCart(informacion.id, JSON.stringify(productoParaAgregarACarrito, null, 2))
    res.redirect('/carrito')
})

/* COMPRAR */

app.post('/comprar/:idCarrito', isAuth, async (req, res) => {
    const idCarrito = req.params.idCarrito
    const productosAComprar = await productosEnCarrito.getCartByUserId(idCarrito)
    console.log('productosAComprar es', productosAComprar)
    const datosComprador = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    console.log('datosComprador es', datosComprador)
    const productoComprado = await listaDeCompras.saveCompra(JSON.stringify(productosAComprar.productos, null, 2), JSON.stringify(datosComprador, null, 2))
    console.log('productoComprado es', productoComprado)
    res.redirect('/')
})

/* SOCKET */

io.on('connection', async (sockets) => {
    sockets.emit('product', await listaDeProductos.getProds())
    sockets.on('new-product', async data => {
        await listaDeProductos.saveProd(data)
        io.sockets.emit('product', await listaDeProductos.getProds())
    })
    
    sockets.emit('mensajes', await listarMensajesNormalizados())


    sockets.on('new-message', async dato => {
        await historialDeMensajes.saveMsj(dato)
        io.sockets.emit('mensajes', await listarMensajesNormalizados())
    })
})

async function listarMensajesNormalizados() {
    const mensajes = await historialDeMensajes.getMsg()
    const normalizados = normalizer({ id: 'mensajes', mensajes })
    return normalizados
}

httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT)) 