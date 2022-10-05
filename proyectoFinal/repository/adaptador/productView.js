export default class ProductView {
    product

    constructor(product) {
        this.product = product
    }

    comoTexto() {
        const lines = []
        lines.push(`id: ${this.product.id}`);
        lines.push(`nombre: ${this.product.name}`);
        lines.push(`apellido: ${this.product.price}`);
        lines.push(`dni: ${this.product.thumbnail}`);
        return lines.join('\n')
    }
}