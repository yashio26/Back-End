import { faker } from '@faker-js/faker';
faker.locale = 'es';

function generarProducto() {
    return {
        nombre: faker.commerce.productName(),
        email: faker.commerce.product(),
        imagen: faker.image.avatar(),
    }
}

export default generarProducto;