import mongoose from 'mongoose'

const carritoCollection = 'carrito'

const CarritoSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    idUsuario: {type: String, required: true}
})

export const carrito = mongoose.model(carritoCollection, CarritoSchema);