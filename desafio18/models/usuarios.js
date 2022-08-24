import mongoose from 'mongoose'

const usuariosCollection = 'usuarios'

const UsuarioSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phone: {type: Number, required: true},
    avatar: {type: String, required: true}
})

export const usuarios = mongoose.model(usuariosCollection, UsuarioSchema);