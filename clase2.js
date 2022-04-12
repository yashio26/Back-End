class Usuario{
    constructor(nombre, apellido, libros, mascotas){
        this.nombre= nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName(){
        return `¡Hola! Mi nombre es ${this.nombre} ${this.apellido}.`;
    }

    addMascota(nuevaMascota){
        this.mascotas.push(nuevaMascota);
    }

    countMascotas(){
        return this.mascotas.length;
    }

    addBook(nuevoNombre, nuevoAutor){
        this.libros.push({nombre: nuevoNombre, autor: nuevoAutor});
    }

    getBookNames(){
        return this.libros.map(libro => {
            return libro.nombre;
        });
    }
}

let usuario = new Usuario('Dario', 'Proaño', [{nombre: 'Sangre en la piscina', autor: 'Agatha Christie'}], ['Luna']);

console.log(usuario.getFullName());

usuario.addMascota('Sol');
console.log(usuario.mascotas);

console.log(usuario.countMascotas());

usuario.addBook('Las minas del rey Salomón', 'Henry Rider Haggard');
console.log(usuario.libros);

console.log(usuario.getBookNames());