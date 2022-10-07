import mongoose from "mongoose"
import * as models from "../../models/usuarios.js"
import { createTransport } from "nodemailer"
import { returnUserDto } from "../dto/userDto.js"
import { returnUserLoginDto } from "../dto/userLoginDto.js"
import dotenv from 'dotenv/config'

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
    Teléfono: ${user.phone}
    Avatar: ${user.avatar}`
})

class ContainerUsers{
    constructor(){
        this.URL = process.env.MONGO_USER
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
            const idUsuario = await this.getUserByUsername(user.username)
            console.log('idUsuario', idUsuario.id)
            return (idUsuario.id)
        }
        catch(error){
            throw new Error(error)
        }
    }

    async getUserByUsername(username, login){
        try{
            if (login === 'login'){
                const usuario = await models.usuarios.findOne({username: username})
                return returnUserLoginDto(usuario)
            } else {
                const usuario = await models.usuarios.findOne({username: username})
                if (!usuario) {
                    return usuario
                } else {
                    return returnUserDto(usuario)
                }
            }
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
            return returnUserDto(usuarios)
        }
        catch(error){
            throw new Error (error)
        }
    }
}

export default ContainerUsers

/* const usuario = new ContainerUsers()
console.log(usuario.getIdOfUser('pruebaParaCrearCarrito')) */