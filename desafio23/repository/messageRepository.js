import ContenedorMensajes from "../persistence/daos/messagesDaoFile.js";
import { returnMessageDto } from "../persistence/dto/messageDto.js"; 
import Message from "./models/messageModel.js";

export default class MessagesRepository {
    dao

    constructor() {
        this.dao = new ContenedorMensajes
    }

    async getMsg() {
        const messages = await this.dao.getMsg()
        return messages.map(p => new Message(p))
    }

    async saveMsj(message) {
        await this.dao.saveMsj(returnMessageDto(message))
        return message
    } 
}