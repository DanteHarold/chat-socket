const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`EL Rol ${rol} no está registrado en la DB`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo: correo });
  if (existeEmail) {
    throw new Error(`El Correo ${correo} ya está registrado`);
  }
};
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id  ${id} no Existe`);
  }
};

/*
Categoria
*/
const existeCategoria = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id  ${id} no Existe`);
  }
};
const existeProducto = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id  ${id} no Existe`);
  }
};

//* Validar COlleciones Permitidas
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La Extension ${coleccion} no es permitida, ${colecciones}`
    );
  }

  return true;
};
module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
};
