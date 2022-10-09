import { normalize, schema } from 'normalizr'
import util from 'util'

function print(objeto) {
  console.log(util.inspect(objeto,false,12,true))
}

const autorSchema = new schema.Entity("author", {}, {idAttribute: 'email'})

const mensajeSchema = new schema.Entity('mensaje', {nombre: autorSchema}, {idAttribute: 'id'})

const chatSchema = new schema.Entity("mensajes", {
    mensajes: [mensajeSchema]},
    {idAttribute: 'id'}
)


function normalizer(obj) {
  let normalizado = normalize(obj, chatSchema)
  return normalizado
}

export default normalizer