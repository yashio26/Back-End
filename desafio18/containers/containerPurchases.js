import mongoose from "mongoose";
import * as models from "../models/compra.js"
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

const mailOptions = (nuevaCompra) => ({
    from: mail,
    to: mail,
    subject: '¡Se realizó una compra en DBDStore!',
    text: `Se ha registrado una nueva compra en DBDStore. Sus datos son:
    Productos: ${nuevaCompra.productos}
    Comprador: ${nuevaCompra.comprador}
    Telefono: ${nuevaCompra.comprador.phone}
    Timestamp: ${nuevaCompra.timestamp}`
})

class ContenedorCompra{
    constructor(){
        this.URL = "mongodb+srv://coderhouse:coderhouse@cluster0.xhcwo.mongodb.net/compras?retryWrites=true&w=majority"
        let conexion = mongoose.createConnection(this.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conectado a MongoDB")
    }

    async saveCompra(productosAComprar, datosComprador){
        try{
            let timestamp = Date.now()
            const newObj = {productos: productosAComprar, comprador: datosComprador, timestamp: timestamp};
            console.log(newObj)
            const nuevaCompra = await models.compra.create(newObj)
            const enviarMail = await transporter.sendMail(mailOptions(nuevaCompra))
            return ('Compra creada con la orden número ' + nuevaCompra._id)
        }catch(error){
            throw new Error (error)
        }
    }
}

export default ContenedorCompra;