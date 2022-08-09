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
/*  */
import passport from 'passport'
import LocalStrategy from 'passport-local'
import dotenv from 'dotenv/config'
import parseArgs from 'yargs/yargs'
import { fork } from 'child_process'
import path from 'path'

import compression from 'compression'

const PORT = parseInt(process.argv.slice(2)) || 8080
/* const { PORT, _ } = yargs
    .alias({
        p: 'PORT'
    })
    .default({
        PORT: 8080
    })
    .argv

console.log({ PORT, _ }) */

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


passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
        const usuario = await listaDeUsuarios.getUserByUsername(username)
        if (usuario) {
            return done(null, false)
        }
        const user = {
            username,
            password
        }
        listaDeUsuarios.saveUser(user)
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
        res.render('iniciosesion.ejs')
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
    res.render('bienvenida.ejs', { username })
})

/* CERRAR SESION */

app.get('/sesioncerrada', (req, res) => {
    req.logout(err => {
        req.session.destroy(err => {
            res.redirect('/iniciosesion')
        })
    })
})



const inputArguments = process.argv
const directory = process.cwd()
const processId = process.pid
const windowsVersion = process.platform
const nodeVersion = process.version
const reservedMemory = process.memoryUsage.rss()
const executionPath = process.execPath

app.get('/info', (req, res) => {
    res.render('info.ejs', { inputArguments, directory, processId, windowsVersion, nodeVersion, reservedMemory, executionPath })
})

app.get('/gzip', compression(), (req, res) => {
    res.render('info.ejs', { inputArguments, directory, processId, windowsVersion, nodeVersion, reservedMemory, executionPath })
}) 

app.get('/randoms', (req, res) => {
    const cantidadDeNumeros = req.query.cant || 100000000
    const computo = fork(path.resolve(process.cwd(), 'computo.js'))
    computo.on('message', mensaje => {
        if (mensaje === 'listo') {
            computo.send(cantidadDeNumeros)
        } else {
            res.render('randoms.ejs', { mensaje })
        }
    })
})

io.on('connection', async (sockets) => {
    sockets.emit('product', await listaDeProductos.getProds())//Comentar el de abajo para usar firebase.
    //sockets.emit('product', await listaDeProductos.testingProducts())//Metodo parcial para mostrar test de productos.
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