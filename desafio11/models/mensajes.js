import mongoose from 'mongoose'

const mensajesCollection = 'mensajes'

const mensajesSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true},
    imagen: {type: String, required: true},
})

export const mensajes = mongoose.model(mensajesCollection, mensajesSchema);