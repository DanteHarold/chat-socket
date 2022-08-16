const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  const query = req.query;
  res.json({
    mgs: "get Api - Controlador",
    query,
  });
};
const usuariosPost = (req, res = response) => {
  const body = req.body;
  res.json({
    mgs: "post Api - Controlador",
    body,
  });
};
const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  res.json({
    mgs: "put Api - Controlador",
    id,
  });
};
const usuariosDelete = (req, res = response) => {
  res.json({
    mgs: "delete Api - Controlador",
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
