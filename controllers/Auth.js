import  bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { crearUsuario, obtenerPorEmail } from '../models/User.js';

//Registro
export const registrarUsuario = async (req, res)=>{
    try {
        const {nombre,email,password}=req.body

        //validar datos
        if(!nombre || !email || !password){
            return res.status (400).json({
                error: 'Faltan usuarios' 
            });
        }

        //Verificamos si el gmail existe

        const {data: usuarioExiste}= await obtenerPorEmail(email);
        if(usuarioExiste){
            return res.status (400).json({
                error:'el email ya existe'
            });
        }

        //encriptar la contrasena

        const hashedPassword= await bcrypt.hash(password,10);

        //rol por defecto
        const rolPorDefecto = 'usuario';

        //guardar en la base de datos
        const { data, error } = await crearUsuario(
            nombre,
            email,
            hashedPassword,
            rolPorDefecto
        );

        if (error) {
            console.error('Error de Supabase al crear usuario:', error);
            return res.status(500).json({
                error: 'Error al crear el usuario'
            });
        }

        return res.status(201).json({
            message: 'Usuario registrado con exito',
            usuario: {
                id: data[0].id,
                nombre: data[0].nombre,
                email: data[0].email,
                rol: data[0].rol
            }
        });
        
    } catch (error) {
        console.error ('Error en registro:', error);
        return res.status(500).json({
            error: error.message
        });
    }
};



//crear login
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'faltan datos de login'
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data?.session) {
            return res.status(400).json({
                error: error?.message || 'credenciales incorrectas'
            });
        }

        return res.status(200).json({
            message: 'login exitoso',
            token: data.session.access_token,
            usuario: {
                id: data.user.id,
                nombre: data.user.user_metadata?.nombre || data.user.email,
                email: data.user.email,
                rol: 'usuario'
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({
            error: error.message
        });
    }
};