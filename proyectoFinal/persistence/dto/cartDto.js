export default class CartDTO {
    constructor({ products }) {
        this.productos = products
    }
}

export function returnCartDto(products) {
    if (Array.isArray(products)) {
        return products.map(product => new CartDTO(product))
    } else {
        return new CartDTO(products)
    }
}