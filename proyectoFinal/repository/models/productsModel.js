export default class Product {
    #id
    #name
    #price
    #thumbnail

    constructor({name, price, thumbnail, id }) {
        this.id = id
        this.name = name
        this.price = price
        this.thumbnail = thumbnail
    }

    get id() { return this.#id }

    set id(id) {
        if (!id) throw new Error('"id" es un campo requerido')
        this.#id = id
    }

    get name() { return this.#name }

    set name(name) {
        if (!name) throw new Error('"name" es un campo requerido')
        this.#name = name
    }

    get price() { return this.#price }

    set price(price) {
        if (!price) throw new Error('"price" es un campo requerido')
        if (isNaN(price)) throw new Error('"price" es un campo de caracteres exclusivamente numéricos')
        this.#price = price
    }

    get thumbnail() { return this.#thumbnail }

    set thumbnail(thumbnail) {
        if (!thumbnail) throw new Error('"thumbnail" es un campo requerido')
        this.#thumbnail = thumbnail
    }

    datos() {
        return JSON.parse(JSON.stringify({
            id: this.#id,
            name: this.#name,
            price: this.#price,
            thumbnail: this.#thumbnail
        }))
    }
}