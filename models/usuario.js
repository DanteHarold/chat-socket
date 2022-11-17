const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, " EL Nombre es Obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El Correo El Obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La Contrasñea es Obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    //required: [true, "El ROl es Obligatorio"],
    //enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
