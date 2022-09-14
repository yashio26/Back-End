export default class CartDTO {
    constructor({ products }) {
        this.productos = products
    }
}

export function returnCartDto(products) {
    if (Array.isArray(products)) {
        console.log('es array!')
        return products.map(product => new CartDTO(product))
    } else {
        console.log('no es array!')
        return new CartDTO(products)
    }
}