//import ContenedorProductos from './contenedores/contenedorProductos.js'
//import ContenedorCarrito from './contenedores/contenedorCarrito.js'
/* let listaDeProductos = new ContenedorProductos('./productos.txt')
let productosEnCarrito = new ContenedorCarrito('./carrito.txt') */
import ContenedorProductosMongo from './contenedores/contenedorProductosMongo.js'
import ContenedorCarritoFirebase from './contenedorCarritoFirebase.js'
let listaDeProductos = new ContenedorProductosMongo
let productosEnCarrito = new ContenedorCarritoFirebase

import express from 'express'
const Router = express.Router

const app = express()
const routerProductos = new Router()
const routerCarrito = new Router()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let admin = true;
const error = {
    error: 401,
    descripcion: 'No tienes permisos para hacer esta acción.'
}

routerProductos.get('/:id', async (req, res) => {
    const id = req.params.id
    res.json(await listaDeProductos.getById(id))
})

routerProductos.get('/', async (req, res) => {
    res.json(await listaDeProductos.getAll())
})

routerProductos.post('/', async (req, res) => {
    const nuevoProducto = req.body
    if (admin != true){
        res.json(error)
    }
    else{
        res.json(await listaDeProductos.save(nuevoProducto))
    }
})

routerProductos.put('/:id', async (req, res) => {
    const { id } = req.params;
    const obj = req.body;
    if (admin != true){
        res.json(error)
    }
    else{
    res.json(await listaDeProductos.modifById(id, obj))
    }
  });

routerProductos.delete('/:id', async (req, res) => {
    const id = req.params.id
    if (admin != true){
        res.json(error)
    }
    else{
    res.json(await listaDeProductos.deleteById(id))
    }
})

//

routerCarrito.post('/', async (req, res) => {
    res.json(await productosEnCarrito.saveCarrito())
})

routerCarrito.delete('/:id', async (req, res) => {
    const id = req.params.id
    res.json(await productosEnCarrito.deleteCartById(id))
})

routerCarrito.get('/:id/productos', async (req, res) => {
    const id = req.params.id
    res.json(await productosEnCarrito.getCartById(id))
})

/* routerCarrito.post('/:id/productos', async (req, res) => {
    const id = req.params.id
    const productId = req.body.query
    const productoParaAgregarACarrito = await productosEnCarrito.getProductById(productId)
    res.json(await productosEnCarrito.saveProductInCart(id, JSON.stringify(productoParaAgregarACarrito, null, 2)))
}) */

/* routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    const idCarrito = req.params.id
    const idProducto = parseInt(req.params.id_prod)
    res.json(await productosEnCarrito.deleteProductInCartById(idCarrito, idProducto))
}) */

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)



const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))