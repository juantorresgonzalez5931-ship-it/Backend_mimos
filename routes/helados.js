import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCat, crear, editar, eliminar } from '../controllers/heladoController.js';

const router = express.Router();

// GET - Obtener todos
router.get('/helados', listarHelados);

// GET - Obtener por ID
router.get('/helados/:id', obtenerHelado);

// GET - Obtener por categoría
router.get('/helados/categoria/:categoria', obtenerPorCat);

// POST - Crear helado
router.post('/helados', crear);

// PUT - Actualizar helado
router.put('/helados/:id', editar);

// DELETE - Eliminar helado
router.delete('/helados/:id', eliminar);

export default router;