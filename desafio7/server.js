const ContenedorProductos = require('./contenedorProductos')
const ContenedorCarrito = require('./contenedorCarrito')
let listaDeProductos = new ContenedorProductos('./productos.txt')
let productosEnCarrito = new ContenedorCarrito('./carrito.txt')

const express = require('express')
const { Router } = express

const app = express()
const routerProductos = new Router()
const routerCarrito = new Router()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

routerProductos.get('/:id?', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await listaDeProductos.getById(id))
    console.log('Hace el get de productos')
})

routerProductos.post('/', async (req, res) => {
    //FRONT-END
    //const nuevoProducto = req.body
    //res.json(await listaDeProductos.save(nuevoProducto))
    res.json(await listaDeProductos.save({nombre: "zarina", descripcion: "personaje", codigo: "21", foto: "", precio: "$100", stock: "20"}))
})

routerProductos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const productoMod = {};
    productoMod.titulo = req.body.titulo;
    productoMod.precio = req.body.precio;
    productoMod.foto = req.body.foto;
    await listaDeProductos.modifById(id, productoMod);
    res.send("Producto Modificado");
  });

routerProductos.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await listaDeProductos.deleteById(id))
})

//

routerCarrito.post('/', async (req, res) => {
    //const nuevoProducto = req.body
    //res.json(await productosEnCarrito.save(nuevoProducto))
    res.json(await productosEnCarrito.saveCarrito())
})

routerCarrito.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await productosEnCarrito.deleteByIdCarrito(id))
})

routerCarrito.get('/:id/productos', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await productosEnCarrito.getById(id))
    console.log('Hace el get de carrito')
})

routerCarrito.post('/:id/productos', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await productosEnCarrito.getProduct(id))
})

routerCarrito.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await productosEnCarrito.deleteById(id))
})

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)



const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))