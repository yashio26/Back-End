/* const Contenedor = require('./clase6')
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

 */

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

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const productoActualizado = req.body
    producto1[parseInt(id) - 1] = productoActualizado
    console.log(productoActualizado)
    res.json({prueba: productoActualizado})
})

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








/* 
app.get('/api/frase', (req, res) => {
    res.send({frase: frase})
})

app.get('/api/letras/:num', (req, res) => {
    const num = parseInt(req.params.num)

    if (isNaN(num)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    }

    if (num < 1 || num > frase.length) {
        return res.send({ error: 'El parámetro está fuera de rango' })
    }

    res.send(frase[num - 1])
})


app.get('/api/palabras/:num', (req, res) => {
    const num = parseInt(req.params.num)

    if (isNaN(num)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    }

    const palabras = frase.split(' ')
    if (num < 1 || num > palabras.length) {
        return res.send({ error: 'El parámetro está fuera de rango' })
    }

    res.send(palabras[num - 1])
})
 */