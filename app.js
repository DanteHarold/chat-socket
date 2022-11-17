require("dotenv").config();

//* Inicializando el Server desde la Clase
const Server = require("./models/server");
const server = new Server();
server.listen();
