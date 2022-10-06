import mongoose from "mongoose";
import * as models from "../../models/compra.js"
import { createTransport } from "nodemailer"
import twilio from "twilio"
import dotenv from 'dotenv/config'

const accountSid = process.env.ACCOUNT_SID_TWILIO
const authToken = process.env.AUTH_TOKEN_TWILIO //El token se encuentra en el readme

const client = twilio(accountSid, authToken)

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
    text: `Se ha registrado una nueva compra en DBDStore, con el timestamp ${nuevaCompra.timestamp}. Los datos del cliente son:
    Comprador: ${nuevaCompra.comprador}
    Productos: ${nuevaCompra.productos}`
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
            const nuevaCompra = await models.compra.create(newObj)
            const enviarMail = await transporter.sendMail(mailOptions(nuevaCompra))
            const enviarSMS = await client.messages.create({
                body: `Se ha registrado una nueva compra en DBDStore, con el timestamp ${nuevaCompra.timestamp}. Los datos del cliente son:
                Comprador: ${nuevaCompra.comprador}
                Productos: ${nuevaCompra.productos}`,
                from: `whatsapp:+14155238886`,
                to: `whatsapp:+5491136342495`
            })
            return ('Compra creada con la orden número ' + nuevaCompra.id)
        }catch(error){
            throw new Error (error)
        }
    }
}

export default ContenedorCompra;