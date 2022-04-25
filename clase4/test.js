const Contenedor = require('./clase4')



async function main() {

    let producto1 = new Contenedor('./productos.txt')
    producto1.save({titulo: 'Motherboard', precio: 300, foto: 'fotoMotherboard'});
    //await producto1.getById(2);
    //await producto1.getAll();
    //producto1.deleteById(1);
    //producto1.deleteAll()
}

main()