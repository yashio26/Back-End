const sockets = io.connect()

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

sockets.on("testProducts", function(data) {render(data)})