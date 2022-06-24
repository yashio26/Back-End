import express from 'express'
import { createServer } from 'http'
/* import { IOServer } from 'socket.io' */
import { Server } from 'socket.io'
import contenedorMensajes from './contenedores/contenedorMensajes.js'
import ContenedorProductos from './contenedorProductos.js'
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const listaDeProductos = new ContenedorProductos

/* contenedorMensajes.crearTablaMsg() */

app.use(express.static('./public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('pages/index.ejs')
})

app.get('/api/productos-test', async (req, res) => {
    res.render('pages/test.ejs')
})

io.on('connection', async (sockets) => {
    sockets.emit('product', await listaDeProductos.getProds())//Comentar el de abajo para usar firebase.
    sockets.emit('product', await listaDeProductos.testingProducts())//Metodo parcial para mostrar test de productos, en linea 46 está el que quise usar.
    console.log('Un cliente se ha conectado!')
/*     sockets.emit('messages', await contenedorMensajes.getMsg()) */
    sockets.on('new-product', async data => {
        await listaDeProductos.saveProd(data)
        io.sockets.emit('product', await listaDeProductos.getProds())
    })

    /* No anda metodo para imprimir en pagina aparte */
/*     io.sockets.emit('testProducts', await listaDeProductos.testingProducts()) */
    /*  */

/*     sockets.on('new-message', async dato => {
        await contenedorMensajes.saveMsj(dato)
        io.sockets.emit('messages', await contenedorMensajes.getMsg())
    }) */
})


const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))