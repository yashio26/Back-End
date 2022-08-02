const knex = require('knex');
const { options } = require('./options/mysqlconn')

class Contenedor {
    constructor(options) {
        this.knex = knex(options);
    }

    async crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
            .finally(() => {
                return this.knex.schema.createTable('productos', table => {
                    table.varchar('name', 50).notNullable()
                    table.float('price', 10.2).notNullable()
                    table.varchar('thumbnail', 500).notNullable()
                })
            })
    }


    async saveProd(articulos) {
        return this.knex('productos').insert(articulos)
    }


    async getProds() {
        return this.knex('productos').select('*')
    }
};



const archivo1 = new Contenedor(options)
module.exports = archivo1;