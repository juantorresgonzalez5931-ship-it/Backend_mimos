import express, { Router } from "express";
import {getUsuarios, getUsuariosporId, putUsuariosporId, deleteUsuarios} from "../controllers/User.js";

const router = express.Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuariosporId);
router.put('/actualizar/:id', putUsuariosporId);
router.delete('/eliminar/:id', deleteUsuarios);

export default router;