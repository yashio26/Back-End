import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync("../db/desafio11-2970b-firebase-adminsdk-833dr-11cba7c705.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
console.log("Conectado a firebase")  

class Contenedor {
    constructor() {
        this.db = admin.firestore()
        this.query = this.db.collection('productos')
    }







    async saveProd(articulos) {
        return this.knex('productos').insert(articulos)
    }


    async getProds() {
        return this.knex('productos').select('*')
    }
};

export default Contenedor;