import passport from 'passport'
import LocalStrategy from 'passport-local'
import express from 'express'

const app = express()

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
        const usuario = await listaDeUsuarios.getUserByUsername(username)
        if (usuario) {
            return done(null, false)
        }
        const user = {
            username,
            password
        }
        listaDeUsuarios.saveUser(user)
        console.log('Usuario creado')
        return done(null, user)
    }
))

passport.use('login', new LocalStrategy( async (username, password, done) => {
    const user = await listaDeUsuarios.getUserByUsername(username)
    if (!user) {
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



app.use(passport.initialize())
app.use(passport.session())



function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('No iniciaste sesion')
    res.redirect('/iniciosesion')
}

export default passport;