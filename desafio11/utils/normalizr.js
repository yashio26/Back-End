import { normalize, denormalize, schema } from 'normalizr'
import print from './print.js'

const autorSchema = new schema.Entity("autor")

const chatSchema = new schema.Entity("mensajes", {
    author: autorSchema,
})


function normalizer(obj) {
  let normalizado = normalize(obj, [chatSchema])
  //console.log(normalizado)
  console.log('entra a normalizer')
  return normalizado
}

export default normalizer