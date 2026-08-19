import express from 'express';
import dotenv from 'dotenv';
import { conectaDB,supabase } from './config/supabase.js';
import AuthRoutes from './routes/Auth.js';
import UserRoutes from './routes/User.js';
import heladosRoutes from './routes/helados.js';
import pedidosRoutes from './routes/Pedidos.js';
import cors from 'cors';

//CARGAR VARIABLES
dotenv.config();
conectaDB();


//CREAMOS LA APLICACION DE EXPRESS
const app = express();

//LEER EL JSON
app.use(express.json());
app.use(cors());
//CREAMOS LA RUTA
app.get('/',(req,res)=>{
    res.json({
        Mensaje:"Bienvenido al BACKEND de MIMOS",
        Estado: "En linea",
        Version:"1.0.0"
    })
})

//RUTAS DE AUTENTICACION
app.use('/auth',AuthRoutes);
//RUTAS DE USUARIOS
app.use('/users',UserRoutes);
//Ruta de helados
app.use('/api',heladosRoutes);
//Ruta de pedidos
app.use('/api',pedidosRoutes);


// Manejador de errores global (SIEMPRE al final, después de las rutas)
app.use((err, req, res, next) => {
    console.error('Error capturado:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

//CONFIGURAMOS EL PUERTO 
const PORT = 3000;

//PONER A ESCUCHAR EL SERVIDOR
app.listen(PORT,()=>{
    console.log(`Servidor escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});