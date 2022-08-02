const Contenedor = require('./clase6')
let producto1 = new Contenedor('./productos.txt')

const express = require('express')
const PORT = 8080
const app = express()
const server = app.listen(PORT, () => {
    console.log('Servidor HTTP escuchando en el puerto ' + PORT)
})

app.get('/', (req, res) => {
    res.send('<h2>Para ver los productos: "/productos", para que arroje un producto al azar: "/productoRandom"</h2>')
})

app.get('/productos', async (req, res) => {
    res.send(await producto1.getAll())
})

app.get('/productoRandom', async (req, res) => {
    res.send(await producto1.getByIdRandom())
})

//app.get('/nuevoProducto', async (req, res) => {
//    res.send(producto1.save({titulo: 'Motherboard', precio: 300, foto: 'fotoMotherboard'}))
//})