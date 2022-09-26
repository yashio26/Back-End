import koa from 'koa'
import koaBody from 'koa-body'
import mount from 'koa-mount'
const app = new koa()
import views from 'koa-views'
import controllerGraph from './graphql/controller.js'
import { graphqlHTTP } from 'koa-graphql'

const PORT = process.env.PORT || 8080

app.use(koaBody())
app.use(mount('/graphql', graphqlHTTP(controllerGraph)))

app.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))