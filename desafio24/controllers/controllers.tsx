import { Context } from "../deps/deps.ts";
import type { Color } from "../colorType.ts";
import * as colorDB from "../persistence/colorMemory.ts";

export const createColor = async (ctx: Context) => {
  try {
    const data = await ctx.request.body().value;
    const {code} = JSON.parse(data)
    const createdColor: Color = await colorDB.saveColor(code);
    console.log('Nuevo color: ', createdColor)
    ctx.response.body = createdColor;
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { msg: err.message };
  }
};

export const pageColor = async (ctx: Context) => {
  try {
    ctx.response.body = `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Desafio 24</title>
          <style>
            body {
              background: linear-gradient(to bottom, #303030, #230000);
              color: grey;
            }
            #colorInput {
              width: 5vw;
              height: 6vh;
              border-radius: 8px;
            }
            ul {
              list-style: none;
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
            }
            li {
              font-weight: bold;
              font-size: 20px;
            }
            li span {
              display: block;
              width: 10vw;
              height: 20vh;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Desafio 24: Paleta de colores con Denon</h1>
          <ul id="colorList">
          <li>No tiene colores guardados. Puede elegir uno en la seccion de abajo</li>
          </ul>
          <input type="color" id="colorInput">
        </body>
        <script>
          const colorInput = document.getElementById("colorInput");
          const colorList = document.getElementById("colorList");
          colorInput.addEventListener('change', (e) => {
            const code = e.target.value
            fetch('http://localhost:8080/api/colors', {
              method: 'POST',
              body: JSON.stringify({code})
            })
            fetch('http://localhost:8080/api/colors')
              .then(res => res.json())
              .then(data => {
                if(Array.isArray(data) && data.length > 0) {
                  let dataHtml = ""
                  data.forEach(item => {
                    dataHtml += '<li style="color:'+ item.code+'">' + item.code + '<span style="background:'+ item.code +'"></span></li>'
                  })
                  colorList.innerHTML = dataHtml
                }
              })
          })
        </script>
      </html>
    ` 
    ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.body = { msg: err.message };
  }
};


export const findColors = async (ctx: Context) => {
  try {
    const colors: Color[] = await colorDB.getAll();
    ctx.response.body = colors;
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.body = { msg: err.message };
  }
};