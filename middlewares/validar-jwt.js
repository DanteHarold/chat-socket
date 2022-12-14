const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      mgs: "No hay Token en la Petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //* Leer al usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no Válido - Usuario no existente en DB",
      });
    }

    //* Verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no Válido - Usuario con estado - false",
      });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Token no Válido",
    });
  }
};
module.exports = {
  validarJWT,
};
