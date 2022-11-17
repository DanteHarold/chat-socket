const path = require("path");
const { v4: uuidv4 } = require("uuid");
const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    //* Recibe el Archivo
    const { archivo } = files;

    //* Obteniendo la Extension del Archivo
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    //* Validar Extensión
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La Extensión ${extension} no es Permitida, ${extensionesValidas}`
      );
    }

    //*Crear un Nombre Unico
    const nombreTemp = uuidv4() + "." + extension;

    //* El Path del Archivo Generado
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    //* Moviendo al Path Dado
    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
