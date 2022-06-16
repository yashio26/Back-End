import mongoose from 'mongoose'
import * as models from '../models/productos.js'

class ContenedorProductosMongo{
    constructor(){
        this.URL = "mongodb://localhost:27017/ecommerce"
        let conexion = mongoose.connect(this.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conectado a MongoDB")
    }

    async save(obj) {
        try{
            let timestamp = Date.now()
            const newObj = {...obj, timestamp: timestamp};
            console.log(newObj)
            await models.productos.create(newObj);
            return ('Item añadido')
        }catch(error){
            throw new Error (error)
        }
    }

    async getById(id){
        let productoEncontrado = await models.productos.findOne({_id: id})
        console.log(productoEncontrado)
        return (productoEncontrado)
    }

    async getAll(){
        try{
            const usuarios = await models.productos.find()
            console.log(usuarios)
            return (usuarios)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async deleteById(numeroId){
        try{
            let productoEliminado = await models.productos.findOneAndDelete({_id: numeroId})
            console.log(productoEliminado)
            return (productoEliminado)
        }
        catch(error){
            throw new Error(error)
        }
    }

    async modifById(id, obj){
        try{
            let productoActualizado = await models.productos.findByIdAndUpdate(
                {_id: id}, obj
            )
            console.log(productoActualizado)
            return (productoActualizado)
        }
        catch (error){
            throw new Error(error)
        }
    }
}

export default ContenedorProductosMongo

//let productos = new ContenedorProductosMongo()

//productos.save({nombre: "dwight", descripcion: "personaje", codigo: "23", foto: "a", precio: 100, stock: 10})
//productos.getAll()
//productos.getById('62aa69689b38380cea785899')
//productos.deleteById('62aa633ee633346a0e5874a6')
//productos.modifById('62aa630a2454ab547509e1d3', {nombre: "zarina", descripcion: "pj", codigo: "3", foto: "vb", precio: 10, stock: 100})
