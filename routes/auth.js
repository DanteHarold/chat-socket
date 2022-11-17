const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login, loginSignIn } = require("../controllers/auth");
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
module.exports = router;
