const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/arnaldoWeb')    
}

main()
.then(console.log("Banco de dados conectado!"))
.catch(err => console.log(err))

module.exports = mongoose