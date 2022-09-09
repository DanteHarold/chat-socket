const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/productos");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const router = Router();

//* Obtener todas los Productos - Publico
router.get("/", obtenerProductos);
//* Obtener un Producto por Id - Publico
router.get(
  "/:id",
  [
    check("id", "No es un Id de Mongo Válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);
//* Crear Categoria - Privada - cualquier persona con token Válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    check("descripcion", "La Descripción es Obligatoria").not().isEmpty(),
    check("categoria", "La Categoria es Obligatoria").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);
//* Actualizar Categoira - Privada
router.put(
  "/:id",
  [validarJWT, check("id").custom(existeProducto), validarCampos],
  actualizarProducto
);
//* Eliminar una Categoria  - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un Id de Mongo Válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  eliminarProducto
);
module.exports = router;
