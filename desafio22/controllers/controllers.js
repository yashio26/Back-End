import ContainerUsers from '../persistence/daos/usersDaoDb.js'
const listaDeUsuarios = new ContainerUsers;
/* import ContenedorProductos from '../persistence/daos/productsDaoDb.js'
const listaDeProductos = new ContenedorProductos; */
import ProductsRepository from '../repository/productsRepository.js';
const listaDeProductos = new ProductsRepository
import ContenedorCarrito from '../persistence/daos/cartDaoDb.js'
const productosEnCarrito = new ContenedorCarrito;
import ContainerPurchases from '../persistence/daos/purchasesDaoDb.js'
const listaDeCompras = new ContainerPurchases;

async function getRegister(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else{
        res.render('registro.ejs')
    }
}

async function errorRegister(req, res) {
    res.render('errorRegistro.ejs')
}

/* INICIO SESION */

async function getLogin(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else{
        res.render('inicioSesion.ejs')
    }
}

async function errorLogin(req, res) {
    res.render('errorInicioSesion.ejs')
}

/* INICIO */

async function getHome(req, res) {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const carrito = await productosEnCarrito.getCartByUserId(informacion.id)
    res.render('bienvenida.ejs', { username: informacion.username, avatar: informacion.avatar, carrito: carrito.productos })
}

/* DATOS PERSONALES */

async function getPersonalData(req, res) {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    res.render('datosPersonales.ejs', { informacion })
}

/* CERRAR SESION */

async function getLogout(req, res) {
    req.logout(err => {
        req.session.destroy(err => {
            res.redirect('/iniciosesion')
        })
    })
}

/* CARRITO */

async function getCart(req, res) {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const carrito = await productosEnCarrito.getCartByUserId(informacion.id)
    res.render('carrito.ejs', { productos: carrito.productos,  idCarrito: carrito.idUsuario })
}

/* AGREGAR PRODUCTO A CARRITO */

async function postProductToCart(req, res) {
    const idProducto = req.params.idProducto
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const productoParaAgregarACarrito = await listaDeProductos.getById(idProducto)
    console.log('productoParaAgregarACarrito es ', productoParaAgregarACarrito)
    const carritoActualizado = await productosEnCarrito.saveProductInCart(informacion.id, JSON.stringify(productoParaAgregarACarrito, null, 2))
    res.redirect('/carrito')
}

/* COMPRAR */

async function postBuy(req, res) {
    const idCarrito = req.params.idCarrito
    const productosAComprar = await productosEnCarrito.getCartByUserId(idCarrito)
    console.log('productosAComprar es', productosAComprar)
    const datosComprador = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    console.log('datosComprador es', datosComprador)
    const productoComprado = await listaDeCompras.saveCompra(JSON.stringify(productosAComprar.productos, null, 2), JSON.stringify(datosComprador, null, 2))
    console.log('productoComprado es', productoComprado)
    res.redirect('/')
}

export default { getRegister, errorRegister, getLogin, errorLogin, getHome, getPersonalData, getLogout, getCart, postProductToCart, postBuy }