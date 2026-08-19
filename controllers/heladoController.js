import { obtenerTodos, obtenerPorId, obtenerPorCategoria, crearHelado, actualizarHelado,
eliminarHelado } from '../models/heladoModel.js';

export const listarHelados = async (req, res) => {
  try {
    const { data, error } = await obtenerTodos();
    if (error) return res.status(500).json({ error: 'Error al obtener' });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerHelado = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await obtenerPorId(id);
    if (error || !data) return res.status(404).json({ error: 'No encontrado' });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerPorCat = async (req, res) => {
  try {
    const { categoria } = req.params;
    const { data, error } = await obtenerPorCategoria(categoria);
    if (error) return res.status(500).json({ error: 'Error' });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  };

export const crear = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, sabor } =
req.body;

    //cloudinary almacena la url
    const imagen_url = req.file ? req.file.path : null;

    //validacion: ahora verificamos que req.file haya entregado la url
    if (!nombre || !precio || !imagen_url) {
      return res.status(400).json({ error: 'nombre, precio e imagen_url requeridos' });
    }
    const { data, error } = await crearHelado({
      nombre, descripcion, precio, stock, imagen_url, categoria, sabor
    });
    if (error) return res.status(500).json({ error: 'Error al crear' });
    return res.status(201).json({ message: 'Creado', helado: data[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await actualizarHelado(id, req.body);
    if (error) return res.status(500).json({ error: 'Error al actualizar' });
    return res.status(200).json({ message: 'Actualizado', helado: data[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await eliminarHelado(id);
    if (error) return res.status(500).json({ error: 'Error al eliminar' });
    return res.status(200).json({ message: 'Eliminado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};