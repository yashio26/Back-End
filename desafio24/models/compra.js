import mongoose from 'mongoose'

const compraCollection = 'compra'

const CompraSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    comprador: {type: String, required: true},
    timestamp: {type: Number, required: true}
})

export const compra = mongoose.model(compraCollection, CompraSchema);