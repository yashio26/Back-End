const sockets = io.connect()

function addProduct(e) {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    sockets.emit("new-product", product);
    return false
}

function render(data) {
    const html = data.map((elem, index) => {
        return(`
        <tr>
        <td>${elem.name}</td>
        <td>$ ${elem.price}</td>
        <td><img src="${elem.thumbnail}" height="40vh" width="40vw"></img></td>
        </tr>`)
    }).join(" ")
    document.getElementById("product").innerHTML = html
}

sockets.on("product", function(data) {render(data)})


function addMessage(a) {
    let date = new Date();
    const message = {
        author: {
            id: document.getElementById("id").value,
            nombre: document.getElementById("name").value,
            apellido: document.getElementById("lastname").value,
            edad: document.getElementById("age").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
            },
        text: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString()
    }
    sockets.emit("new-message", message);
    return false
}

function renders(dato) {
    try{
        const html2 = dato.map((element, index) => {
            return(`
            <div style="border: 1px solid black">
                <div>
                    <h4 style="color: rgb(255, 225, 225)">${element.author.id}: ${element.message}</h4>
                </div>
                <div>
                    <p class="date">Enviado el ${element.fecha} a las ${element.hora}</p>
                </div>
            </div>`)
        }).join(" ")
    
        document.getElementById("messages").innerHTML = html2
    } catch (error){
        throw new Error(error)
    }
}

sockets.on("messages", function(dato) {renders(dato)})