const { response, request } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .populate("usuario")
      .populate("categoria")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    msg: "get - Controlador",
    productos,
    total,
  });
};
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findOne({ _id: id }).populate("categoria");
  res.json({
    producto,
  });
};
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...resto } = req.body;

  if (resto.nombre) {
    resto.nombre = resto.nombre.toUpperCase();
  }
  resto.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: "Put - controlador",
    producto,
  });
};
const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...resto } = req.body;

  const productoDB = await Producto.findOne({ nombre: resto.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El Producto ${productoDB.nombre}, ya existe`,
    });
  }

  //* Generar la Data a Guardar
  const data = {
    nombre: resto.nombre.toUpperCase(),
    ...resto,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  //* Guardar en la DB
  await producto.save();

  res.status(201).json(producto);
};
const eliminarProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  );

  res.json({
    msg: "Delete - Controlador",
    producto,
  });
};
module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
};
