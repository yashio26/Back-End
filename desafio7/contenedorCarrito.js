const fs = require('fs');

class ContenedorCarrito{
    constructor(rutaDeArchivo){
        this.rutaDeArchivo = rutaDeArchivo;
    }

    async saveCarrito(){
        const objs = await this.getAll()
        let timestamp = Date.now()
        let newId
        if (objs.length == 0) {
          newId = 1
        } else {
          newId = objs[objs.length - 1].id + 1
        }
        const newObj = {id: newId, timestamp: timestamp, productos: []}
        objs.push(newObj)
        try{
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(objs, null, 2))
            return newId
        }
        catch{
            throw new Error(`Error al guardar carrito: ${error}`)
        }
    }

    async saveProductInCart(id, productoParaAgregarACarrito){
        let productoParaAgregarACarritoParseado = JSON.parse(productoParaAgregarACarrito)
        try{
            let carrito = await this.getAll()
            let index = carrito.findIndex(o => {
                return o.id === id
            })
            let carritoEncontrado = carrito[index]
            let productosDelCarrito = carritoEncontrado.productos
            productosDelCarrito.push(productoParaAgregarACarritoParseado)
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(carrito, null, 2))
            return ('Producto agregado al carrito!')
        }
        catch(err){
            return (`Error al traer el producto: ${err}`)
        }
    }

    async getProductById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile('./productos.txt', 'utf-8'))
            let productoEncontrado = listaProductos.find((producto) => {
                return producto.id === numeroId
            })
            if (productoEncontrado == (undefined || null)){
                return('El producto no se encontró.')
            }
            else{
                return productoEncontrado;
            }
        }
        catch(err){
            throw new Error (`Error al traer el producto: ${err}`)

        }
    }

    async getCartById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEncontrado = listaProductos.find((producto) => {
                return producto.id === numeroId
            })
            if (productoEncontrado == (undefined || null)){
                return('El producto no se encontró.');
            }
            else{
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
            return JSON.parse(listaProductos)
        }
        catch(err){
            return []
        }
    }

    async deleteCartById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEliminado = listaProductos.filter((producto) => {
                return producto.id !== numeroId
            })
            fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(productoEliminado, null, 2))
            return ('Carrito eliminado!')
        }
        catch (err){
            throw new Error(`Hubo un error al eliminar id del producto: ${err}`)
        }
    }

    async deleteProductInCartById(idCarrito, idProducto){
        try{
            let carrito = await this.getAll()
            let indexCarrito = carrito.findIndex(o => {
                return o.id === idCarrito
            })
            let productosEnCarrito = carrito[indexCarrito].productos
            let indexProducto = productosEnCarrito.findIndex(o => {
                return o.id === idProducto
            })
            if(indexProducto < 0){
                return ('No se encontró el producto en el carrito.')
            }
            else{
                productosEnCarrito.splice(indexProducto, 1)
                fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(carrito, null, 2))
                return ('Se eliminó el producto del carrito!')
            }
        }
        catch(error){
            throw new Error(`Hubo un error al eliminar: ${error}`)
        }
    }
}



module.exports = ContenedorCarrito