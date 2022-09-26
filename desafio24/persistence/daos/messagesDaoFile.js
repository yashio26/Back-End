import fs from 'fs'
import { returnMessageDto } from '../dto/messageDto.js'

class ContenedorMensajes{
    constructor(){

    }

    async saveMsj(msg){
        let historial = await this.getMsg()
        let newId
        if(historial.length === 0){
            newId = 1
        } else{
            newId = historial[historial.length - 1].id + 1
        }
        const newElem = {...msg, id: newId}
        historial.push(newElem)
        try{
            await fs.promises.writeFile('./chat.json', JSON.stringify(historial, null, 2))
            console.log('entrando a savemsj')
        }
        catch(error){
            throw new Error(error)
        }
    };

    async getMsg(){
        try{
            const mensajeObtenido = await fs.promises.readFile('./chat.json', 'utf-8')
            console.log('entrando a getmsg')
            return returnMessageDto(JSON.parse(mensajeObtenido))
        }
        catch(error){
            throw new Error(error)
        }
    }
}

export default ContenedorMensajes