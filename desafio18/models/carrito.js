import mongoose from 'mongoose'

const carritoCollection = 'carrito'

const CarritoSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    timestamp: {type: Number, required: true},
})

export const carrito = mongoose.model(carritoCollection, CarritoSchema);