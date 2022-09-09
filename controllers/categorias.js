const { response, request } = require("express");
const { Categoria } = require("../models");

const obtenercategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    msg: "get - Controlador",
    categorias,
    total,
  });
};
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findOne({ _id: id }).populate("usuario");
  res.json({
    categoria,
  });
};
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();
  resto.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: "Put - controlador",
    categoria,
  });
};
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La Categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  //* Generar la Data a Guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //* Guardar en la DB
  await categoria.save();

  res.status(201).json(categoria);
};
const eliminarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  );

  res.json({
    msg: "Delete - Controlador",
    categoria,
  });
};
module.exports = {
  crearCategoria,
  obtenercategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
