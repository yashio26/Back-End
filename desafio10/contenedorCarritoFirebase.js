import admin from "firebase-admin";

import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync("./db/da-entrega-backend-firebase-adminsdk-65voa-a71aa232ef.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Conectado a firebase")

class ContenedorCarritoFirebase {
    constructor(){
        this.db = admin.firestore()
        this.query = this.db.collection('carrito')
    }

    async saveCarrito(){
        try{
            const timestamp = Date.now()
            let doc = await this.query.doc()
            await doc.create({timestamp: timestamp, productos: []})
        }
        catch (error){
            throw new Error (error)
        }
    }

    async getAll(){
        try{
            const querySnapshot = await this.query.get()
            const docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                id: doc.id,
                timestamp: doc.data().timestamp,
                productos: doc.data().productos
            }))
            console.log (response)
        }
        catch (error){
            throw new Error (error)
        }
    }

    async getCartById(numeroId){
        try{
            let doc = this.query.doc(`${numeroId}`);
            let item = await doc.get()
            let response = item.data()
            console.log(response.productos)
            return (response.productos)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async deleteCartById (numeroId){
        try{
            let doc = this.query.doc(`${numeroId}`)
            let item = await doc.delete()
            console.log (`Se borro el carrito ${numeroId}`)
            return (`Se borró el carrito ${numeroId}`)
        }
        catch (error){
            throw new Error (error)
        }
    }
}

export default ContenedorCarritoFirebase
//let carritos = new ContenedorCarritoFirebase()

//carritos.getCartById(2)
//carritos.saveCarrito()
//carritos.getAll()
//carritos.deleteCartById(4)