import express, { Router } from "express";
import {registrarUsuario,loginUsuario} from "../controllers/Auth.js";

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

export default router;