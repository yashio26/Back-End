export default class ProductoDTO {
    constructor({ id, name, price, thumbnail }) {
        this.id = id
        this.name = name
        this.price = price
        this.thumbnail = thumbnail
    }
}

export function returnProductDto(products) {
    if (Array.isArray(products)) {
        return products.map(product => new ProductoDTO(product))
    } else {
        return new ProductoDTO(products)
    }
}