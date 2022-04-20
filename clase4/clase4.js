const fs = require('fs');

class Contenedor{
    constructor(rutaDeArchivo){
        this.rutaDeArchivo = rutaDeArchivo;
    }

    async save(obj){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let ultimoId = Math.max(
                ...listaProductos.map(producto => producto.id)
            )
            if (ultimoId === -Infinity){
                obj.id = 1;
            }
            else{
                obj.id = ultimoId + 1;
            }
            listaProductos.push(obj)
            fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(listaProductos, null, 2))
            console.log(`Producto guardado! Se le asignó el id N°${obj.id}`)
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEncontrado = listaProductos.find((producto) => {
                return producto.id === numeroId
            })
            if (productoEncontrado == (undefined || null)){
                console.log('El producto no se encontró.');
            }
            else{
                console.log('El producto encontrado es: ', productoEncontrado);
            }

        }
        catch(err){
            console.log('Hubo un error al traer el producto :', err)
            
        }
    }

    async getAll(){
        try{
            let listaProductos = await fs.promises.readFile(this.rutaDeArchivo, 'utf-8')
            console.log(listaProductos)
        }
        catch(err){
            console.log('Error al leer los datos: ', err)
        }
    }

    async deleteById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEliminado = listaProductos.filter((producto) => {
                return producto.id !== numeroId
            })
            console.log(productoEliminado);
            fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(productoEliminado, null, 2))
        }
        catch (err){
            console.log('Hubo un error al eliminar id del producto: ', err)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify([]), null, 2)
            console.log('Se limpió la lista de productos')
        }
        catch(err){
            console.log('Hubo un error: ', err)
        }
    }
}

let producto1 = new Contenedor('./productos.txt')
//producto1.save({titulo: 'Motherboard', precio: 300, foto: 'fotoMotherboard'});
//producto1.getById(2);
//producto1.getAll();
//producto1.deleteById(1);
//producto1.deleteAll()