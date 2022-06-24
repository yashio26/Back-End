import { faker } from '@faker-js/faker';
faker.locale = 'es';

function generarProducto() {
    const productosGenerados = {
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.avatar(),
    }
    console.log(productosGenerados)
    return(productosGenerados)
}

export default generarProducto;