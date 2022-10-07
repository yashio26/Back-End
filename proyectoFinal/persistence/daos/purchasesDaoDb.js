import mongoose from "mongoose";
import * as models from "../../models/compra.js"
import { createTransport } from "nodemailer"
import twilio from "twilio"
import dotenv from 'dotenv/config'

const accountSid = process.env.ACCOUNT_SID_TWILIO
const authToken = process.env.AUTH_TOKEN_TWILIO //El token se encuentra en el readme

const client = twilio(accountSid, authToken)

const mail = process.env.MAIL
const contrasenia = process.env.CONTRASENIA

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
    text: `Se ha registrado una nueva compra en DBDStore, con el id ${nuevaCompra.id} y el timestamp ${nuevaCompra.timestamp}. Los datos del cliente son:
    Comprador: ${nuevaCompra.comprador}
    Productos: ${nuevaCompra.productos}`
})

class ContenedorCompra{
    constructor(){
        this.URL = process.env.MONGO_PURCHASE
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
            const nuevaCompra = await models.compra.create(newObj)
            const enviarMail = await transporter.sendMail(mailOptions(nuevaCompra))
            const enviarSMS = await client.messages.create({
                body: `Se ha registrado una nueva compra en DBDStore, con el id ${nuevaCompra.id} y el timestamp ${nuevaCompra.timestamp}. Los datos del cliente son:
                Comprador: ${nuevaCompra.comprador}
                Productos: ${nuevaCompra.productos}`,
                from: `whatsapp:+14155238886`,
                to: `whatsapp:${process.env.NUMERO_CELULAR}`
            })
            return 'Compra finalizada con exito'
        }catch(error){
            throw new Error (error)
        }
    }
}

export default ContenedorCompra;