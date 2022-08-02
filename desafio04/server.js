const Contenedor = require('./clase8')
let producto1 = new Contenedor('./productos.txt')

const express = require('express')
const { Router } = express

const app = express()
const router = Router()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const frase = 'Hola mundo como están'

router.get('/', async (req, res) => {
    res.json(await producto1.getAll())
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await producto1.getById(id))
})

router.post('/', async (req, res) => {
    const nuevoProducto = req.body
    res.json(await producto1.save(nuevoProducto))
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const productoMod = {};
    productoMod.titulo = req.body.titulo;
    productoMod.precio = req.body.precio;
    productoMod.foto = req.body.foto;
    await producto1.modifById(id, productoMod);
    res.send("Producto Modificado");
  });

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await producto1.deleteById(id))
})

app.use('/api/productos', router)



const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))