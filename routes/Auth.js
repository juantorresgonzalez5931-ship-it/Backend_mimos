import express, { Router } from "express";
import {registrarUsuario,loginUsuario} from "../controllers/Auth.js";
import { forgotPassword, verifyCode } from "../controllers/recuperar.js";

const router = express.Router();

//Rutas de autenticacion
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

//Ruta para recuperar contraseña
router.post('/forgot-password', forgotPassword);
router.post ('/verify-code', verifyCode);

export default router;

