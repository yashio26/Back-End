import mongoose from "mongoose"
import * as models from "../models/usuarios.js"

class ContainerUsers{
    constructor(){
        this.URL = 'mongodb://coderhouse:coderhouse@cluster0-shard-00-00.xhcwo.mongodb.net:27017,cluster0-shard-00-01.xhcwo.mongodb.net:27017,cluster0-shard-00-02.xhcwo.mongodb.net:27017/usuarios?ssl=true&replicaSet=atlas-4fo5qj-shard-0&authSource=admin&retryWrites=true&w=majority'
        let conexion = mongoose.connect(this.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conectado a MongoDB")
    }

    async saveUser(user){
        try{
            await models.usuarios.create(user)
        }
        catch(error){
            throw new Error(error)
        }
    }

    async getUserByUsername(username){
        try{
            const usuario = await models.usuarios.findOne({username: username})
            return (usuario)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async getAll(){
        try{
            const usuarios = await models.usuarios.find()
            console.log('Todos los usuarios encontrados en contenedor')
            return (usuarios)
        }
        catch(error){
            throw new Error (error)
        }
    }
}

export default ContainerUsers