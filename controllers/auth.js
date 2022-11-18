const { response, request, json } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const loginSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //* Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: "al",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    //* Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el Administrador, Usuario Bloqueado",
      });
    }

    //*Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Todo Bien! Google SignIn",
      usuario,
      token,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "El Token no se pudo Verificar",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;
  //*Generar el JWT
  const token = await generarJWT(usuario.id);
  res.json({
    usuario,
    token,
  });
};

module.exports = {
  login,
  loginSignIn,
  renovarToken,
};
