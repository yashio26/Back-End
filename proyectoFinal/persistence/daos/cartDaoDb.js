import mongoose from 'mongoose'
import * as models from '../../models/carrito.js'
import { returnCartDto } from '../dto/cartDto.js'
import dotenv from 'dotenv/config'


class ContenedorCarritoMongo{
    constructor(){
        this.URL = process.env.MONGO_CART
        let conexion = mongoose.createConnection(this.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conectado a MongoDB")
    }

    async saveCarrito(idUsuario) {
        try{
            let timestamp = Date.now()
            const newObj = {idUsuario: idUsuario};
            await models.carrito.create(newObj);
            return (idUsuario)
        }catch(error){
            throw new Error (error)
        }
    }

    async getCartByUserId(idUsuario){
        let carritoEncontrado = await models.carrito.findOne({idUsuario: idUsuario})
        return returnCartDto(carritoEncontrado)
    }

    async saveProductInCart(idUsuario, obj){
        try{
            let carritoEncontrado = await models.carrito.findOneAndUpdate({idUsuario: idUsuario}, {$push: {productos: obj}}, {new: true})
            return (`Se agregó el producto n° ${obj.id}`)
        }
        catch (error){
            throw new Error(error)
        }
    }

    async deleteProductInCartById(idCarrito, idProducto){
        try{
            let carritoEncontrado = await models.carrito.findOneAndUpdate({idUsuario: idCarrito}, {$pull: {productos: {id: idProducto}}})
            return (`Se eliminó el producto n° ${idProducto}`)
        }
        catch (error){
            throw new Error(error)
        }
    }

    async deleteProductsInCart(idCarrito){
        try{
            let carritoEncontrado = await models.carrito.findOneAndUpdate({idUsuario: idCarrito}, {$set: {productos: []}})
            return (`Se eliminaron todos los productos`)
        }
        catch (error){
            throw new Error(error)
        }
    }
}

export default ContenedorCarritoMongo