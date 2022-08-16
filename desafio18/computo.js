const numeros = {}

function numerosRandom() {
    return parseInt(Math.random() * 1000) + 1
}

function calcularNumeros(cantidad){
    for (let i = 1; i <= cantidad ; i++) {
        const numero = numerosRandom()
        if (!numeros[numero]) {
            numeros[numero] = 0
        }
    
        numeros[numero]++
    }
    return numeros
}

process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    process.send(JSON.stringify(calcularNumeros(msg), null, 2))
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')