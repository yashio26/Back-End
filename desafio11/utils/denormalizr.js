import { normalize, denormalize, schema } from 'normalizr'
import print from './print.js'

const autorSchema = new schema.Entity("autor")

const chatSchema = new schema.Entity("mensajes", {
    author: autorSchema,
})

function desnormalizer(obj){
    let desnormalizado = denormalize(obj.result, [chatSchema], obj.entities)
    console.log('obj es: ', obj)
    console.log('desnormalizado es:')
    print(desnormalizado)
    return desnormalizado
}

export default desnormalizer