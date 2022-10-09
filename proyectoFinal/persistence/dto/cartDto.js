export default class CartDTO {
    constructor({ productos, idUsuario }) {
        this.productos = productos
        this.idUsuario = idUsuario
    }
}

export function returnCartDto(products) {
    if (Array.isArray(products)) {
        return products.map(product => new CartDTO(product))
    } else {
        return new CartDTO(products)
    }
}