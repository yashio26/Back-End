import admin from 'firebase-admin';
import fs from 'fs';
import generarProducto from '../../utils/generadorDeProductos.js';
import { returnProductDto } from '../dto/productDto.js';
import dotenv from 'dotenv/config'
const { privateKey } = JSON.parse(process.env.PRIVATE_KEY)

const serviceAccount = {
    type: 'service_account',
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    privateKey,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
console.log("Conectado a firebase")  

class ContenedorProductos {
    constructor() {
        this.db = admin.firestore()
        this.query = this.db.collection('productos')
        this.memory = []
    }

    async testingProducts(){
        try{
            for(let i = 0; i < 5; i++){
                let fakeProd = generarProducto()
                this.memory.push(fakeProd)
            }
            // console.log(this.memory)
            return this.memory;
        }
        catch(error){
            throw new Error(error)
        }
    }

    async saveProd(articulos) {
        try{
            let doc = await this.query.doc()
            await doc.create(articulos)
            return (`Se agregó: ${returnProductDto(articulos)}`)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async getProdById(id) {
        try{
            let prodEncontrado = await this.query.doc(id).get()
            console.log('prod encontrado es: ', prodEncontrado.id, prodEncontrado.data())
            const response = {id: prodEncontrado.id, name: prodEncontrado.data().name, price: prodEncontrado.data().price, thumbnail: prodEncontrado.data().thumbnail}
            console.log('response es: ', response)
            return returnProductDto(response)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async getProds() {
        try{
            const querySnapshot = await this.query.get()
            const docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                price: doc.data().price,
                thumbnail: doc.data().thumbnail
            }))
            return returnProductDto(response)
        }
        catch(error){
            throw new Error(error)
        }
    }

    async deleteProduct(id) {
        try{
            const querySnapshot = await this.query.doc(id).delete()
            return ('producto borrado')
        }
        catch (error){
            throw new Error(error)
        }
    }
};

export default ContenedorProductos;

/* const productoParaAgregarACarrito = new ContenedorProductos()

console.log(await productoParaAgregarACarrito.getProdById('csufR5fDLrwsdSaZqhH8')) */