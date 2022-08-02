const express = require('express')

const app = express()

const productos = []

app.set('views', './views')

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', productos)
})

app.post('/productos', (req, res) => {
    productos.push(req.body)
    res.redirect('/')
})

app.get('/productos', (req, res) => {
    res.render('productos', {productos})
})

const server = app.listen(8080, () => {
    console.log('Servidor esta corriendo satisfactoriamente')
})