import mongoose from "mongoose"
import * as models from "../../models/usuarios.js"
import { createTransport } from "nodemailer"

const mail = 'yashio200007@gmail.com'
const contrasenia = 'vxiyfmfxfugroikb'

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: mail,
        pass: contrasenia
    }
})

const mailOptions = (user) => ({
    from: mail,
    to: mail,
    subject: '¡Nuevo usuario registrado en DBDStore!',
    text: `Se ha registrado un nuevo usuario en DBDStore. Sus datos son:
    Email: ${user.email}
    Usuario: ${user.username}
    Nombre: ${user.name}
    Dirección: ${user.address}
    Edad: ${user.age}
    Teléfono: ${user.phone}`
})

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
            const enviarMail = await transporter.sendMail(mailOptions(user))
            console.log(enviarMail)
            const idUsuario = await this.getUserByUsername(user.username)
            console.log('idUsuario', idUsuario)
            return (idUsuario._id)
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

    async getIdOfUser(username){
        try{
            const usuario = await models.usuarios.findOne({username: username})
            console.log('Usuario encontrado en contenedor: ', usuario)
            console.log('idUsuario', usuario._id)
            return (usuario._id)
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

/* const usuario = new ContainerUsers()
console.log(usuario.getIdOfUser('pruebaParaCrearCarrito')) */