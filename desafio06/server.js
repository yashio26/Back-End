const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const Contenedor = require('./contenedorMsg.js')
const Container = require('./contenedorProd.js')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const { promises: fs} = require('fs')

app.use(express.static('./public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('pages/index.ejs', {root: __dirname})
})

app.post('/saveProd', async (req, res) => {
    const { name, price, thumbnail } = req.body
    const add = await Contenedor.saveProds({ name, price, thumbnail })
    res.redirect('/')
})

io.on('connection', async (sockets) => {
    const product = await Container.getProds()
    sockets.emit('product', await Container.getProds())
    console.log('Un cliente se ha conectado!')
    sockets.emit('messages', await Contenedor.getMessage())
    sockets.on('new-product', async data => {
        await Container.saveProd(data)        
        io.sockets.emit('product', await Container.getProds())
    })
    sockets.on('new-message', async dato => {
        await Contenedor.saveMsj(dato)
        io.sockets.emit('messages', await Contenedor.getMessage())
    })
})

const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))