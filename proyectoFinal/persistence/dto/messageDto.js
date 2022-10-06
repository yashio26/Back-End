export default class MessageDTO {
    constructor({ author, text, fecha, hora, id }) {
        this.author = author
        this.text = text
        this.fecha = fecha
        this.hora = hora
        this.id = id
    }
}

export function returnMessageDto(messages) {
    if (Array.isArray(messages)) {
        return messages.map(message => new MessageDTO(message))
    } else {
        return new MessageDTO(messages)
    }
}