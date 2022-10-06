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
import ContenedorMensajes from './persistence/daos/messagesDaoFile.js'
const historialDeMensajes = new ContenedorMensajes
/* import MessagesRepository from './repository/messageRepository.js'
const historialDeMensajes = new MessagesRepository; */
import ContenedorProductos from './persistence/daos/productsDaoDb.js'
const listaDeProductos = new ContenedorProductos;
import rutasUrl from './routes/routes.js'
import dotenv from 'dotenv/config'
import methodOverride from 'method-override'

const PORT = process.env.PORT || 8080

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: advancedOptions,
    ttl: 600
})

app.use(methodOverride('_method'))
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
app.use('/', rutasUrl)

/* SOCKET */

io.on('connection', async (sockets) => {
    sockets.emit('product', await listaDeProductos.getProds())
    sockets.on('new-product', async data => {
        await listaDeProductos.saveProd(data)
        io.sockets.emit('product', await listaDeProductos.getProds())
    })
    sockets.emit('mensajes', await listarMensajesNormalizados())
    const chat = await listarMensajesNormalizados()
    sockets.on('new-message', async dato => {
        await historialDeMensajes.saveMsj(dato)
        io.sockets.emit('mensajes', await listarMensajesNormalizados())
    })
})

/* FUNCTION DE SOCKET */

async function listarMensajesNormalizados() {
    const mensajes = await historialDeMensajes.getMsg()
    const normalizados = normalizer({ id: 'mensajes', mensajes })
    return normalizados
}

httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))