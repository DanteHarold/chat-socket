const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenercategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const router = Router();

//* Obtener todas las Categorias - Publico
router.get("/", obtenercategorias);
//* Obtener una categoria por Id - Publico
router.get(
  "/:id",
  [
    check("id", "No es un Id de Mongo Válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);
//* Crear Categoria - Privada - cualquier persona con token Válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
//* Actualizar Categoira - Privada
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);
//* Eliminar una Categoria  - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un Id de Mongo Válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  eliminarCategoria
);
module.exports = router;
