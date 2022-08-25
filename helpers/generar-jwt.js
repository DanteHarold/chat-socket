const jwt = require("jsonwebtoken");
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

module.exports = {
  generarJWT,
};
