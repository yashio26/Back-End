const sockets = io.connect()

function addProduct(e) {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    sockets.emit("new-product", product);
    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("thumbnail").value = ""
    return false
}

function render(data) {
    const html = data.map((elem, index) => {
        return(`
        <tr>
        <td>${elem.name}</td>
        <td>$ ${elem.price}</td>
        <td><img src="${elem.thumbnail}" height="60vh" width="60vw"></img></td>
        <td>
            <form action="/agregar/${elem.id}" method="post">
                <input type="submit" value="Agregar al carrito" class="btn btn-primary">
            </form>
        </td>
        </tr>`)
    }).join(" ")
    document.getElementById("product").innerHTML = html
}

sockets.on("product", function(data) {render(data)})


const autorSchema = new normalizr.schema.Entity("author", {}, {idAttribute: 'id'})

const mensajeSchema = new normalizr.schema.Entity('mensaje', {nombre: autorSchema}, {idAttribute: 'id'})

const chatSchema = new normalizr.schema.Entity("mensajes", {mensajes: [mensajeSchema]},{idAttribute: 'id'}) 


function addMessage(a) {
    let date = new Date();
    const message = {
        author: {
            id: document.getElementById("email").value,
            },
        text: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString()
    }
    sockets.emit("new-message", message);
    document.getElementById("text").value = ""
    return false
}

function renders(dato) {
    return dato.map((element) => {
        return(`
        <div style="border: 1px solid black">
            <div>
                <h4 style="color: rgb(255, 225, 225)">${element.author.id}: ${element.text}</h4>
            </div>
            <div>
                <p class="date">Enviado el ${element.fecha} a las ${element.hora}</p>
            </div>
        </div>`)
    }).join(" ")
}

    
    sockets.on("mensajes", messages =>{
    let msjsSize = JSON.stringify(messages).length

    console.log('messagesNormaliz===', messages, msjsSize)

    let desnormalizado = normalizr.denormalize(messages.result, chatSchema, messages.entities)

    let msjsDesnSize = JSON.stringify(desnormalizado).length

    console.log('messagesDenorm====', desnormalizado, msjsDesnSize)
    console.log('MENSAJES DESNORMALIZADOS', desnormalizado.mensajes)

    const html = renders(desnormalizado.mensajes)
    document.getElementById('messages').innerHTML = html;
})

