import { Router } from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import controllers from '../controllers/controllers.js'
import ContainerUsers from '../persistence/daos/usersDaoDb.js'
const listaDeUsuarios = new ContainerUsers;
import ContenedorCarrito from '../persistence/daos/cartDaoDb.js'
const productosEnCarrito = new ContenedorCarrito;
import bcrypt from 'bcryptjs'

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
    const usuario = await listaDeUsuarios.getUserByUsername(username)
    const email = await listaDeUsuarios.getUserByEmail(req.body.email)
    if (usuario || email) {
        return done(null, false)
    }
    const passwordEncriptado = await bcrypt.hash(password, 10)
    const user = {
        username,
        password: passwordEncriptado,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        phone: req.body.phone,
        avatar: req.body.avatar,
        admin: false
    }
    const newUser = await listaDeUsuarios.saveUser(user)
    productosEnCarrito.saveCarrito(newUser)
    return done(null, user)
}
))

passport.use('login', new LocalStrategy( async (username, password, done) => {
    const user = await listaDeUsuarios.getUserByUsername(username, 'login')
    if (!user) {
        return done(null, false, { message: 'Usuario no existe' })
    }
    const passwordEncriptado = await bcrypt.compare(password, user.password)
    if (!passwordEncriptado) {
        return done(null, false, { message: 'Contraseña incorrecta' })
    }
    console.log('Usuario autenticado')
    return done(null, user)
}))
passport.serializeUser(function (user, done) {
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    const usuario = listaDeUsuarios.getUserByUsername(username)
    done(null, usuario)
})



const rutasUrl = Router()
rutasUrl.use(passport.initialize())
rutasUrl.use(passport.session())



function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('No iniciaste sesion')
    res.redirect('/iniciosesion')
}

rutasUrl.get('/registro', controllers.getRegister)

rutasUrl.post('/registro', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/error-registro'
}))

rutasUrl.get('/error-registro', controllers.errorRegister)

rutasUrl.get('/iniciosesion', controllers.getLogin)

rutasUrl.post('/iniciosesion', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/error-inicio-sesion'
}))

rutasUrl.get('/error-inicio-sesion', controllers.errorLogin)

rutasUrl.get('/', isAuth, controllers.getHome)

rutasUrl.get('/datos-personales', isAuth, controllers.getPersonalData)

rutasUrl.get('/sesioncerrada', controllers.getLogout)

rutasUrl.get('/carrito', isAuth, controllers.getCart)

rutasUrl.get('/compra-finalizada', isAuth, controllers.purchaseComplete)

rutasUrl.post('/agregar/:idProducto', isAuth, controllers.postProductToCart)

rutasUrl.post('/comprar/:idCarrito', isAuth, controllers.postBuy)

rutasUrl.delete('/eliminar/:idProductoEnCarrito', isAuth, controllers.deleteProductInCart)

rutasUrl.delete('/producto/eliminar/:idProducto', controllers.deleteProduct)

export default rutasUrl;