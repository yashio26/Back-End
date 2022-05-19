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
        author: document.getElementById("username").value,
        message: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString(),
    }
    sockets.emit("new-message", message);
    return false
}

function renders(dato) {
    const html2 = dato.map((element, index) => {
        return(`
        <div style="border: 1px solid black">
            <div>
                <h4 style="color: rgb(255, 225, 225)">${element.author}: ${element.message}</h4>
            </div>
            <div>
                <p class="date">Enviado el ${element.fecha} a las ${element.hora}</p>
            </div>
        </div>`)
    }).join(" ")

    document.getElementById("messages").innerHTML = html2
}

sockets.on("messages", function(dato) {renders(dato)})