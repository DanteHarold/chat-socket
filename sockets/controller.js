const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  // console.log("Cliente Conectado", socket.id);
  const token = socket.handshake.headers["x-token"];
  const usuario = await comprobarJWT(token);
  if (!usuario) {
    return socket.disconnect();
  }
  //*Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  //Obtener solo para el usuario los ultimos mensajes
  socket.emit("recibir-mensajes", chatMensajes.ultimos10);
  console.log("Se conectó", usuario.nombre);

  //Conectarlo a una sala especial
  socket.join(usuario.id); //Salas 3 -< global, socket.id, usuario.id

  //*Limpiar cuando alguien se desconecta
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  socket.on("enviar-mensaje", ({ mensaje, uid }) => {
    if (uid) {
      //Mensaje Privada
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    }
    chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
    io.emit("recibir-mensajes", chatMensajes.ultimos10);
  });
};

module.exports = {
  socketController,
};
