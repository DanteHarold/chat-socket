const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT } = require("../middlewares");
const { login, loginSignIn, renovarToken } = require("../controllers/auth");
const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es Obligatorio").isEmail(),
    check("password", "El Contraseña es Obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);
router.post(
  "/google",
  [check("id_token", "id_token es necesario").not().isEmpty(), validarCampos],
  loginSignIn
);

router.get("/", validarJWT, renovarToken);
module.exports = router;
