import ContainerUsers from '../persistence/daos/usersDaoDb.js'
const listaDeUsuarios = new ContainerUsers;
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
    res.render('bienvenida.ejs', { username: informacion.username, avatar: informacion.avatar, carrito: carrito.productos, admin: informacion.admin })
}

/* DATOS PERSONALES */

async function getPersonalData(req, res) {
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const vaciarCarrito = await productosEnCarrito.deleteProductsInCart(informacion.id)
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

/* ELIMINAR PRODUCTO */

async function deleteProduct(req, res) {
    const idProducto = req.body.id
    const productoEliminado = listaDeProductos.deleteById(idProducto)
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
    const carritoActualizado = await productosEnCarrito.saveProductInCart(informacion.id, {
        id: productoParaAgregarACarrito.id,
        name: productoParaAgregarACarrito.name, 
        price: productoParaAgregarACarrito.price, 
        thumbnail: productoParaAgregarACarrito.thumbnail
    })
    res.redirect('/carrito')
}

/* ELIMINAR PRODUCTO EN CARRITO */

async function deleteProductInCart(req, res) {
    const idProducto = req.params.idProductoEnCarrito
    const informacion = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const eliminarProducto = productosEnCarrito.deleteProductInCartById(informacion.id, idProducto)
    res.redirect('/carrito')
}

/* COMPRAR */

async function postBuy(req, res) {
    const idCarrito = req.params.idCarrito
    const productosAComprar = await productosEnCarrito.getCartByUserId(idCarrito)
    const datosComprador = await listaDeUsuarios.getUserByUsername(req.session.passport.user)
    const productoComprado = await listaDeCompras.saveCompra(JSON.stringify(productosAComprar.productos, null, 2), JSON.stringify(datosComprador, null, 2))
    const vaciarCarrito = await productosEnCarrito.deleteProductsInCart(datosComprador.id)
    res.redirect('/compra-finalizada')
}

async function purchaseComplete(req, res) {
    res.render('compraFinalizada.ejs')
}

export default { getRegister, errorRegister, getLogin, errorLogin, getHome, getPersonalData, getLogout, deleteProduct, getCart, postProductToCart, deleteProductInCart, postBuy, purchaseComplete }