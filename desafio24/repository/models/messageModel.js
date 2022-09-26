export default class Message {
    #author
    #text
    #fecha
    #hora
    #id

    constructor({author, text, fecha, hora, id }) {
        this.author = author
        this.text = text
        this.fecha = fecha
        this.hora = hora
        this.id = id
    }

    get id() { return this.#id }

    set id(id) {
        if (!id) throw new Error('"id" es un campo requerido')
        if (isNaN(id)) throw new Error('"id" es un campo de caracteres exclusivamente numéricos')
        this.#id = id
    }

    get author() { return this.#author }

    set author(author) {
        if (!author) throw new Error('"author" es un campo requerido')
        this.#author = author
    }

    get text() { return this.#text }

    set text(text) {
        if (!text) throw new Error('"text" es un campo requerido')
        this.#text = text
    }

    get fecha() { return this.#fecha }

    set fecha(fecha) {
        if (!fecha) throw new Error('"fecha" es un campo requerido')
        this.#fecha = fecha
    }

    get hora() { return this.#hora }

    set hora(hora) {
        if (!hora) throw new Error('"hora" es un campo requerido')
        this.#hora = hora
    }

    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            author: this.#author,
            text: this.#text,
            fecha: this.#fecha,
            hora: this.#hora
        }))
    }
}