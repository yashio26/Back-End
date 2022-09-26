import ContenedorProductos from '../persistence/daos/productsDaoDb.js'
import { graphqlHTTP } from 'koa-graphql'
import { buildSchema } from 'graphql'
const listaDeProductos = new ContenedorProductos

const schema = buildSchema(`
    type Product {
        id: ID!
        name: String,
        price: String,
        thumbnail: String
    }
    input ProductInput {
        name: String,
        price: String,
        thumbnail: String
    }
    type Query {
        getAll: [Product],
    }
    type Mutation {
        save(datos: ProductInput): Product
    }
`)

async function getAll() {
    try{
        const productos = await listaDeProductos.getProds()
        return productos
    }
    catch(error){
        throw new Error(error)
    }
}

async function save({datos}) {
    try{
        const productoNuevo = await listaDeProductos.saveProd(datos)
        return productoNuevo
    }
    catch(error){
        throw new Error(error)
    }
}

/* export default class GraphQLController {
    constructor() {
        const listaDeProductos = new ContenedorProductos
        return graphqlHTTP({
            schema: schema,
            rootValue: {
                getAll: listaDeProductos.getProds(),
                save: listaDeProductos.saveProd()
            },
            graphiql: true
        })
    }
} */

const controllerGraph = {
    schema: schema,
    rootValue: {
        getAll,
        save
    },
    graphiql: true
}

export default controllerGraph