const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.usuariosPath = "/api/usuarios";

    //* Conectar a la Base De Datos
    this.conectarDB();

    //* Middlewares
    this.middlewares();
    //* Rutas de mi Aplicación

    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //* Cors
    this.app.use(cors());

    //* Lectura y Parseo del Body
    this.app.use(express.json());
    //* Directorio Publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
