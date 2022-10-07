import { Router } from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import controllers from '../controllers/controllers.js'
import ContainerUsers from '../persistence/daos/usersDaoDb.js'
const listaDeUsuarios = new ContainerUsers;
import ContenedorCarrito from '../persistence/daos/cartDaoDb.js'
const productosEnCarrito = new ContenedorCarrito;

const rutasUrl = Router()

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
        const usuario = await listaDeUsuarios.getUserByUsername(username)
        if (usuario) {
            return done(null, false)
        }
        const user = {
            username,
            password,
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            age: req.body.age,
            phone: req.body.phone,
            avatar: req.body.avatar
        }
        const newUser = await listaDeUsuarios.saveUser(user)
        console.log('newUser es', newUser)
        productosEnCarrito.saveCarrito(newUser)
        console.log('Usuario creado')
        return done(null, user)
    }
))
passport.use('login', new LocalStrategy( async (username, password, done) => {
    const user = await listaDeUsuarios.getUserByUsername(username, 'login')
    console.log('user es:', user)
    if (!user.username) {
        return done(null, false, { message: 'Usuario no existe' })
    }
    if (user.password !== password) {
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

export default rutasUrl;