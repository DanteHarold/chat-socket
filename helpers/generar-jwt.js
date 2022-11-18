const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const generarJWT = (uid = "") => {
  return new Promise((res, rej) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          rej("No se pudo Generar el Token");
        } else {
          res(token);
        }
      }
    );
  });
};

const comprobarJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    if (usuario) {
      if (usuario.estado) {
        return usuario;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

module.exports = {
  generarJWT,
  comprobarJWT,
};
