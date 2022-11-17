const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  //* const {q, nombre = "No Name", apikey, page = 1 , limit} = req.query;

  const { limite = 5, desde = 0 } = req.query;

  /*

  const usuarios = await Usuario.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limite));
    
    const total = await Usuario.countDocuments({ estado: true });
    */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    mgs: "get Api - Controlador",
    total,
    usuarios,
  });
};
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //* Verificar si el Correo Existe

  //* Encriptar la Contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //* Guardar en la DB
  await usuario.save();
  res.json({
    usuario,
  });
};
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //* Todo validar contra base de Datos

  if (password) {
    //* Encriptar la Contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  //* Actualiza
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    mgs: "put Api - ControladorPut",
    usuario,
  });
};
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  //const uid = req.uid;

  //* Borrado Fisicamente
  //* const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;
  res.json({
    usuario,
    usuarioAutenticado,
    mgs: "delete Api - Controlador",
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
