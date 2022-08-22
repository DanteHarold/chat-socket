const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
} = require("../controllers/usuarios");
const router = Router();

router.get("/", usuariosGet);
router.put(
  "/:id",
  [
    check("id", "No es un Id Válida").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPut
);
router.post(
  "/",
  [
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    check("password", "El Password debe tener mas de 6 letras").isLength({
      min: 6,
    }),

    check("correo", "El Correo no es Válido").isEmail(),
    check("correo").custom(emailExiste),
    //check("rol", "No es un ROL Válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);
router.delete(
  "/:id",
  [
    check("id", "No es un Id Válida").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
