const fs = require('fs');

class Contenedor{
    constructor(rutaDeArchivo){
        this.rutaDeArchivo = rutaDeArchivo;
    }

    async save(obj){
        const objs = await this.getAll()
        console.log(objs)

        let newId
        if (objs.length == 0) {
          newId = 1
        } else {
          newId = objs[objs.length - 1].id + 1
        }
    
        const newObj = { ...obj, id: newId }
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
            throw new Error(`Hubo un error al eliminar id del producto: ${err}`)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(this.rutaDeArchivo, JSON.stringify([]), null, 2)
            console.log('Se limpió la lista de productos')
        }
        catch(err){
            throw new Error(`Hubo un error: ${err}`)
        }
    }

    async getByIdRandom(){
        try{
            let listaProductos = JSON.parse(await fs.promises.readFile(this.rutaDeArchivo, 'utf-8'))
            let productoRandom = listaProductos[Math.floor(Math.random() * listaProductos.length)]
            return productoRandom;
        }
        catch (err){
            throw new Error ('Hubo un error: ', err)
        }

    }

    async modifById(id, obj) {
        const objs = await this.getAll();
        objs.find((o) => o.id == id).titulo = obj.titulo;
        objs.find((o) => o.id == id).precio = obj.precio;
        objs.find((o) => o.id == id).foto = obj.foto;
        try {
          await fs.promises.writeFile(
            this.rutaDeArchivo,
            JSON.stringify(objs, null, 2)
          );
        } 
        catch (error) {
          throw new Error(`Error al modificar: ${error}`);
        }
      }
}



module.exports = Contenedor