import ContenedorProductos from "../persistence/daos/productsDaoDb.js";
import { returnProductDto } from "../persistence/dto/productDto.js";
import Product from "./models/productsModel.js";

export default class ProductsRepository {
    dao

    constructor() {
        this.dao = new ContenedorProductos
    }

    async getAll() {
        const personas = await this.dao.getProds()
        return personas.map(p => new Product(p))
    }

    async getById(id) {
        const persona = await this.dao.getProdById(id)
        console.log('persona es: ', persona)
        return new Product(persona)
    }

    async save(nuevo) {
        await this.dao.saveProd(returnProductDto(nuevo))
        return nuevo
    } 

    async deleteById(id) {
        const productoEliminado = await this.dao.deleteProduct(id)
        return new Product(productoEliminado)
    }

    /* async deleteAll() {
        await this.dao.deleteAll()
    } */
}