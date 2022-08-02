const express = require("express");
const handlebars = require('express-handlebars');

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true})) 

const productos = []

app.engine("handlebars", handlebars.engine())

app.set('views', './views')
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index', {productos, titulo: 'Ingreso de productos'})
})

app.post("/productos", (req, res) => {
    productos.push(req.body)
    res.redirect('/')
});

app.get("/productos", (req, res) => {
    const boolean = productos.length > 0
    res.render('productos', {list: productos, listExists: boolean, titulo: 'Lista de productos'});
});

const PORT = 8080
const server = app.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))