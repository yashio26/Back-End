import express from 'express'

const app = express()
const router = express.Router()

/* REGISTRO */

router.get('/registro', )

router.post('/registro', )

router.get('/error-registro', )

/* INICIO SESION */

router.get('/iniciosesion', )

router.post('/iniciosesion', )

router.get('/error-inicio-sesion', )

/* COMERCIO */

router.get('/', /* isAuth, */ )

/* CERRAR SESION */

router.get('/sesioncerrada', )

export default router;