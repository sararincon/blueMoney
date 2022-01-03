const https = require('https')
const fs = require('fs')
const child_process = require('child_process')

const argumentos = process.argv.slice(2)
const documento = argumentos[0]
const documentoExtension = argumentos[1]
const indicadorEconomico = argumentos[2]
const cantidadPesos = argumentos[3]
let valorConvertido= argumentos[4]
const fecha = new Date()


//Probando data 
console.log(`${documento}`) 
console.log(`${documentoExtension}`) 
console.log(`${indicadorEconomico}`) 
console.log(`${cantidadPesos}`) 

//API CALL
https.get('https://mindicador.cl/api', function (res) {
    res.setEncoding('utf-8');
    var data = '';
 
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
        var mindicador = JSON.parse(data);
        valorConvertido = cantidadPesos / mindicador[indicadorEconomico].valor;
        console.log(valorConvertido)

//Creación de Documento con su data correspondiente 
let resultado = `A la fecha: ${fecha} fue realizada cotización con los siguientes datos: 
Cantidad de pesos a convertir: ${cantidadPesos} pesos. 
Este valor convertido a ${indicadorEconomico} da un total de ${valorConvertido}`
    

    fs.writeFile(`${documento}.${documentoExtension}`, resultado, (err) => {
        if (err)
            console.log(err);
        else {
            console.log('El Documento se ha creado con exito!')
        }
        
        fs.readFile(`${documento}.${documentoExtension}`,'utf-8', function read (err, texto) {
            if (err) {
                throw err;
            }
            console.log(texto)
        })
    })
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message)
})
