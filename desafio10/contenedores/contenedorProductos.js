import fs from 'fs'

class ContenedorProductos{
    constructor(rutaDeArchivo){
        this.rutaDeArchivo = rutaDeArchivo;
    }

    async save(obj){
        const objs = await this.getAll()
        let timestamp = Date.now()
        let newId
        if (objs.length == 0) {
          newId = 1
        } else {
          newId = objs[objs.length - 1].id + 1
        }
        const newObj = { ...obj, id: newId, timestamp: timestamp }
        objs.push(newObj)
    
        try {
          await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(objs, null, 2))
          return newId
        } catch (error) {
          throw new Error(`Error al guardar: ${error}`)
        }
    }

    async getById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEncontrado = listaProductos.find((producto) => {
                return producto.id === numeroId
            })
            if (productoEncontrado == (undefined || null)){
                return('El producto no se encontró.');
            }
            else{
                return productoEncontrado;
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

    async deleteById(numeroId){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoEliminado = listaProductos.filter((producto) => {
                return producto.id !== numeroId
            })
            fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(productoEliminado, null, 2))
            return('Se eliminó el producto.')
        }
        catch (err){
            throw new Error(`Hubo un error al eliminar id del producto: ${err}`)
        }
    }

    async modifById(id, obj) {
        const listaDeProductos = await this.getAll();

        const busquedaDeProducto = listaDeProductos.findIndex(o => {
            return o.id === parseInt(id)
        })
        let timestamp = Date.now()
        const productoActualizado = {...obj, timestamp: timestamp, id: parseInt(id)}
        try {
            listaDeProductos[busquedaDeProducto] = productoActualizado;
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify(listaDeProductos, null, 2));
            return ('El producto fue modificado.')
        } 
        catch (error) {
          throw new Error(`Error al modificar: ${error}`);
        }
      }
}



export default ContenedorProductos