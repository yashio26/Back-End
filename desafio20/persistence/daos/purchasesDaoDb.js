import mongoose from "mongoose";
import * as models from "../../models/compra.js"
import { createTransport } from "nodemailer"
import twilio from "twilio"

const accountSid = 'AC60b52ea091809833fd750ba8d98d976f'
const authToken = '123' //El token se encuentra en el readme

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
            const enviarSMS = await client.messages.create({
                body: `Se ha registrado una nueva compra en DBDStore. Sus datos son:
                Productos: ${nuevaCompra.productos}
                Comprador: ${nuevaCompra.comprador}
                Telefono: ${nuevaCompra.comprador.phone}`,
                from: `whatsapp:+14155238886`,
                to: `whatsapp:+5491136342495`
            })
            console.log("Compra registrada", enviarSMS)
            return ('Compra creada con la orden número ' + nuevaCompra._id)
        }catch(error){
            throw new Error (error)
        }
    }
}

export default ContenedorCompra;