import { faker } from '@faker-js/faker';
faker.locale = 'es';

function generarProducto() {
    const productosGenerados = {
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.avatar(),
    }
    return(productosGenerados)
}

export default generarProducto;