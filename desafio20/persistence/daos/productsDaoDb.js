import admin from 'firebase-admin';
import fs from 'fs';
import generarProducto from '../../utils/generadorDeProductos.js';

const serviceAccount = JSON.parse(fs.readFileSync("./prodDB/desafio11-2970b-firebase-adminsdk-833dr-11cba7c705.json"));

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
            return (`Se agregó: ${articulos}`)
        }
        catch(error){
            throw new Error (error)
        }
    }

    async getProdById(id) {
        try{
            let prodEncontrado = await this.query.doc(id).get()
            return prodEncontrado.data()
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
            return response
        }
        catch(error){
            throw new Error(error)
        }
    }
};

export default ContenedorProductos;

/* const productoParaAgregarACarrito = new ContenedorProductos()

console.log(await productoParaAgregarACarrito.getProdById('csufR5fDLrwsdSaZqhH8')) */