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
/*  */
import ContainerUsers from './containers/containerUsers.js'
const listaDeUsuarios = new ContainerUsers;
/*  */
import passport from 'passport'
import LocalStrategy from 'passport-local'
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
const MongoStore = connectMongo.create({
    mongoUrl: 'mongodb://coderhouse:coderhouse@cluster0-shard-00-00.xhcwo.mongodb.net:27017,cluster0-shard-00-01.xhcwo.mongodb.net:27017,cluster0-shard-00-02.xhcwo.mongodb.net:27017/iniciosesion?ssl=true&replicaSet=atlas-4fo5qj-shard-0&authSource=admin&retryWrites=true&w=majority',
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
        console.log('Registrando usuario con username y password: ', username, password)
        const usuario = await listaDeUsuarios.getUserByUsername(username)
        if (usuario) {
            return done('El usuario ya existe')
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
    res.render('registro.ejs')
})

app.post('/registro', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/error'
}))

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
    failureRedirect: '/error'
}))

/* COMERCIO */

app.get('/', isAuth, (req, res) => {
    const datos = req.user.username
    res.render('bienvenida.ejs', { datos })
})

/* CERRAR SESION */

app.get('/sesioncerrada', (req, res) => {
    req.logout(err => {
        res.redirect('/iniciosesion')
    })
})

app.get('/error', (req, res) => {
    const name = 'Usuario o contraseña incorrectos'
    res.render('sesioncerrada.ejs', { name })
})

/* io.on('connection', async (sockets) => {
    console.log('Un cliente se ha conectado!')
    sockets.on('new-user', async dato => {
        listaDeUsuarios.saveUser(dato)
    })
}) */





const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))









/* io.on('connection', async (sockets) => {
    sockets.emit('product', await Container.getProds())
    console.log('Un cliente se ha conectado!')
    // div
    sockets.emit('messages', await Contenedor.getMsg())

    sockets.on('new-user', async dato => {
        listaDeUsuarios.saveUser(dato)
    })

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
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT)) */

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