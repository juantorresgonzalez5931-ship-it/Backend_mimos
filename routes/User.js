import express, { Router } from "express";
import {getUsuarios, getusuariosPorId, putactualizarUsuario, deleliminarUsuario} from "../controllers/User.js";

const router = express.Router();

router.get('/', getUsuarios);
router.get('/:id', getusuariosPorId);
router.put('/actualizar/:id', putactualizarUsuario);
router.delete('/eliminar/:id', deleliminarUsuario);

export default router;