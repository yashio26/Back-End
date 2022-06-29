import mongoose from 'mongoose'

const mensajesCollection = 'mensajes'

const mensajesSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    email: {type: String, required: true},
    edad: {type: Number, required: true},
    alias: {type: String, required: true},
    avatar: {type: String, required: true},
})

export const mensajes = mongoose.model(mensajesCollection, mensajesSchema);