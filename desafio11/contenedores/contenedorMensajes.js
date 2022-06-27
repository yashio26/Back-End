import normalizer from "../utils/normalizr.js"
import fs from 'fs'
import desnormalizer from "../utils/denormalizr.js"
import print from "../utils/print.js"

class ContenedorMensajes{
    constructor(){

    }

    async saveMsj(msg){
        try{
            let normalizandoMensaje = normalizer(msg)
            let historial = JSON.parse(await fs.promises.readFile('./chat.json'))
            historial.push(normalizandoMensaje)
            await fs.promises.writeFile('./chat.json', JSON.stringify(historial, null, 2))
            console.log('entrando a savemsj')
        }
        catch(error){
            throw new Error(error)
        }
    };

    async getMsg(){
        try{
            let mensajeObtenido = JSON.parse(await fs.promises.readFile('./chat.json'))
            let desnormalizandoMensaje = await desnormalizer(mensajeObtenido)
            console.log('entrando a getmsg:')
            print(desnormalizandoMensaje)
            return desnormalizandoMensaje
        }
        catch(error){
            throw new Error(error)
        }
    }
}

export default ContenedorMensajes