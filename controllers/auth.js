const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //* Verificar si el email existe.
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son Correctos - Correo",
      });
    }
    //* Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / PassWord no son Correctos - estado: false",
      });
    }
    //* Verificar la Contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / PassWord no son Correctos - Password",
      });
    }
    //* Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login OK",
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Hable con el Administrador",
    });
  }
};

module.exports = {
  login,
};
