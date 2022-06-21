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
            await doc.create({timestamp: timestamp})
            return (`Se creó el carrito n° ${doc.id}`)
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

    async saveProductInCart(id, productId, obj) {
        try{
            const productoAgregadoACarrito = await this.query.doc(id).collection('productos').doc(productId).set({productos: obj}, {merge: true})
            console.log(productoAgregadoACarrito)
            return (`Se agregó el producto n° ${productId} al carrito ${id}`);
        }
        catch(error){
            throw new Error (error)
        }
    }

    async deleteProductInCartById(idCarrito, idProducto) {
        try{
            const productoEliminadoDeCarrito = await this.query.doc(idCarrito).collection('productos').doc(idProducto).delete()
            console.log(productoEliminadoDeCarrito)
            return (`Se eliminó el producto n° ${idProducto} del carrito ${idCarrito}`);
        }
        catch(error){
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
//carritos.saveProductInCart('EQrHCCwXbTDvxCkOkyAD', 1, {nombre: 'xd', precio: 2})