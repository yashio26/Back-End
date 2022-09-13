import { strictEqual, deepStrictEqual } from 'assert'
import ContenedorProductos from '../persistence/daos/productsDaoDb.js'

describe('Comprobando sistema de productos', function(){
    beforeEach(function(){
        console.log('Comienzo de test.')
    })

    afterEach(function(){
        console.log('Fin del test.')
    })

    it('Inicializar y verificar que haya 6 productos', async function (){
        const productos = new ContenedorProductos
        const cantidadDeProductos = await productos.getProds()
        strictEqual(cantidadDeProductos.length, 6)
    })

    it('Agregar un producto y verificar que hayan 7 productos', async function (){
        const productos = new ContenedorProductos
        productos.saveProdById({name: 'productoAgregado', price: '20', thumbnail: 'PortadaDeProductoNuevo'})
        const cantidadDeProductos = await productos.getProds()
        strictEqual(cantidadDeProductos.length, 7)
    })

    it('Eliminar producto agregado', async function (){
        const productos = new ContenedorProductos
        productos.deleteProdById('productoAgregado')
        const cantidadDeProductos = await productos.getProds()
        strictEqual(cantidadDeProductos.length, 6)
    })
})