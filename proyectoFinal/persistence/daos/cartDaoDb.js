import mongoose from 'mongoose'
import * as models from '../../models/carrito.js'
import { returnCartDto } from '../dto/cartDto.js'


class ContenedorCarritoMongo{
    constructor(){
        this.URL = "mongodb+srv://coderhouse:coderhouse@cluster0.xhcwo.mongodb.net/carrito?retryWrites=true&w=majority"
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
            console.log(newObj)
            await models.carrito.create(newObj);
            return (idUsuario)
        }catch(error){
            throw new Error (error)
        }
    }

    async getCartByUserId(idUsuario){
        let carritoEncontrado = await models.carrito.findOne({idUsuario: idUsuario})
        return (carritoEncontrado)
        //return returnCartDto(carritoEncontrado)
    }

/*     async getAll(){
        try{
            const usuarios = await models.carrito.find()
            console.log(usuarios)
            return (usuarios)
        }
        catch(error){
            throw new Error (error)
        }
    } */

/*     async testDeCarrito(idUsuario){
        try{
            const carrito = await models.carrito.findOne({idUsuario: idUsuario})
            console.log('carrito con idUsuario ' + idUsuario + ' es: ' + carrito)
        }
        catch(error){
            throw new Error (error)
        }
    } */

/*     async deleteCartById(numeroId){
        try{
            let carritoEliminado = await models.carrito.findOneAndDelete({_id: numeroId})
            console.log(carritoEliminado)
            return (carritoEliminado)
        }
        catch(error){
            throw new Error(error)
        }
    } */

    async saveProductInCart(idUsuario, obj){
        try{
            /* let objParseado = JSON.parse(obj) */
            let carritoEncontrado = await models.carrito.findOneAndUpdate({idUsuario: idUsuario}, {$push: {productos: obj}}, {new: true})
            console.log('carrito encontrado en contenedor es: ' + carritoEncontrado)
            return (`Se agregó el producto n° ${obj.id}`)
        }
        catch (error){
            throw new Error(error)
        }
    }

    async deleteProductInCartById(idCarrito, idProducto){
        try{
            let carritoEncontrado = await models.carrito.findOneAndUpdate({idUsuario: idCarrito}, {$pull: {productos: {id: idProducto}}})
            console.log(carritoEncontrado)
            return (`Se eliminó el producto n° ${idProducto}`)
        }
        catch (error){
            throw new Error(error)
        }
    }
}

export default ContenedorCarritoMongo

//let carrito = new ContenedorCarritoMongo()

//carrito.saveCarrito()
//carrito.getAll()
//carrito.getCartById('62b0d9f8cfd1314416ae440e')
//carrito.deleteCartById('62b0db66746cb5cff251a0bd')
//carrito.saveProductInCart('62b0d9f8cfd1314416ae440e', '5e8f8f8f8f8f8f8f8f8f8f8', { nombre: "zarina", descripcion: "personaje", codigo: "21", foto: "fto", precio: "$100", stock: "20", id: 2, timestamp: 1653441350588})
//carrito.deleteProductInCartById('62b0d9f8cfd1314416ae440e', 1)
//carrito.modifById('62aa630a2454ab547509e1d3', {nombre: "zarina", descripcion: "pj", codigo: "3", foto: "vb", precio: 10, stock: 100})
