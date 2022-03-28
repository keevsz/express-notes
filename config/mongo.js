const mongoose = require("mongoose")
require("dotenv").config()

const database = mongoose
  .connect(process.env.URI)
  .then((m) => {
    console.log("Conectado")
    return m.connection.getClient()
  })
  .catch((e) => console.log("Falló la conexión: " + e))

module.exports = database
