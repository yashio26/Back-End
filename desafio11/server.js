const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const contenedorMensajes = require('./contenedores/contenedorMensajes.js')
const ContenedorProductos = require('./contenedores/contenedorProductos.js').default
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

contenedorMensajes.crearTablaMsg()

app.use(express.static('./public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('pages/index.ejs', {root: __dirname})
})

io.on('connection', async (sockets) => {
    const product = await ContenedorProductos.getProds()
    sockets.emit('product', await ContenedorProductos.getProds())
    console.log('Un cliente se ha conectado!')
    sockets.emit('messages', await contenedorMensajes.getMsg())
    sockets.on('new-product', async data => {
        await ContenedorProductos.saveProd(data)        
        io.sockets.emit('product', await ContenedorProductos.getProds())
    })
    sockets.on('new-message', async dato => {
        await contenedorMensajes.saveMsj(dato)
        io.sockets.emit('messages', await contenedorMensajes.getMsg())
    })
})

const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))