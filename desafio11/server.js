import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import ContenedorMensajes from './contenedores/contenedorMensajes.js'
import ContenedorProductos from './contenedores/contenedorProductos.js'
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const listaDeProductos = new ContenedorProductos
const historialDeMensajes = new ContenedorMensajes

import normalizer from './utils/normalizr.js'

app.use(express.static('./public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('pages/index.ejs')
})

io.on('connection', async (sockets) => {
    sockets.emit('product', await listaDeProductos.getProds())//Comentar el de abajo para usar firebase.
    sockets.emit('product', await listaDeProductos.testingProducts())//Metodo parcial para mostrar test de productos.
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


const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))