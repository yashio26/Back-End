const fs = require('fs');

class ContenedorCarrito{
    constructor(rutaDeArchivo){
        this.rutaDeArchivo = rutaDeArchivo;
    }

    async saveCarrito(){
        const objs = await this.getAll()
        console.log(objs)
        let timestamp = Date.now()
        let newId
        if (objs.length == 0) {
          newId = 1
        } else {
          newId = objs[objs.length - 1].id + 1
        }
        const newObj = {id: newId, timestamp: timestamp, productos: {}}
        objs.push(newObj)
        try{
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(objs, null, 2))
            return newId
        }
        catch{
            throw new Error(`Error al guardar carrito: ${error}`)
        }
    }

    async getProduct(numeroId){
        try{
            let carrito = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoParaAgregarACarrito = await this.getProductById(numeroId)
            //let manolo = {productoParaAgregarACarrito}
            //carrito.push(productoParaAgregarACarrito)
            carrito.push({productos: productoParaAgregarACarrito})
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(carrito, null, 2))
            console.log(carrito)
            return 'xd'
        }
        catch(err){
            return []
        }
    }

    async getProductById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile('./productos.txt', 'utf-8'))
            let productoEncontrado = listaProductos.find((producto) => {
                return producto.id === numeroId
            })
            if (productoEncontrado == (undefined || null)){
                console.log('El producto no se encontró.');
            }
            else{
                console.log('El producto encontrado es: ', productoEncontrado);
                return productoEncontrado;
            }

        }
        catch(err){
            throw new Error (`Error al traer el producto: ${err}`)

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
                return productoEncontrado.productos;
            }

        }
        catch(err){
            throw new Error (`Error al traer el producto: ${err}`)

        }
    }

    async getAll(){
        try{
            let listaProductos = await fs.promises.readFile(this.rutaDeArchivo, 'utf-8')
            console.log(listaProductos)
            return JSON.parse(listaProductos)
        }
        catch(err){
            return []
        }
    }

    async deleteByIdCarrito(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEliminado = listaProductos.filter((producto) => {
                return producto.id !== numeroId
            })
            console.log(productoEliminado);
            fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(productoEliminado, null, 2))
        }
        catch (err){
            throw new Error(`Hubo un error al eliminar id del producto: ${err}`)
        }
    }
}



module.exports = ContenedorCarrito