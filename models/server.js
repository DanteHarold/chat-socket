const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { createServer } = require("http");
const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controller");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      usuarios: "/api/usuarios",
      productos: "/api/productos",
      categorias: "/api/categorias",
      uploads: "/api/uploads",
    };

    //this.usuariosPath = "/api/usuarios";
    //this.authPath = "/api/auth";

    //* Conectar a la Base De Datos
    this.conectarDB();

    //* Middlewares
    this.middlewares();

    //* Rutas de mi Aplicación
    this.routes();

    //*Sockets
    this.sockets();
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

    //* FileUpload - Carga de Archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
