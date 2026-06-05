//importamos el bycript
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { crearUsuario, obtenerPorEmail } from '../models/User.js';

//Registro
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password} = req.body;

    //validar datos
    if (!nombre || !email || !password) {
        return res.status(400).json({
             error: 'faltan datos de usuarios' 
            });
    }
    //verificar si gmail ya existe
    const { data: usuarioExiste } = await obtenerPorEmail(email);
    if (usuarioExiste) {
        return res.status(400).json({
            error: 'el email ya esta registrado'
        });
    }

    //encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //rol por defecto
    const rolpordefecto = 'usuario';

    //guardar en la base de datos
    const { data, error } = await crearUsuario(
        nombre,
        email,
        hashedPassword,
        rolpordefecto
    );

    if (error) {
        return res.status(500).json({
            error: 'error al crear el usuario'
        });
    }

    return res.status(201).json({
        message: 'usuario creado exitosamente',
        usuario: {
            id: data[0].id,
            nombre: data[0].nombre,
            email: data[0].email,
            rol: data[0].rol
        }
    });


    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({
            error: 'Error al registrar usuario'
        });
    }
};



//crear login

export const loginUsuario = async (req, res) => {

    try{
        const { email, password } = req.body;

        //validar datos
        if (!email || !password) {
            return res.status(400).json({
                error: 'faltan datos de login'
            });
        }

        //verificar si el email existe
        const { data: usuario, error } = await obtenerPorEmail(email);

        if (!usuario) {
            return res.status(400).json({
                error: 'email no registrado'
            });
        }

        //verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(400).json({
                error: 'contraseña incorrecta'
            });
        }

        //generar token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email, 
                rol: usuario.rol
            },

            process.env.JWT_SECRET,
        { expiresIn: '1h' }

        );
    
        return res.status(200).json({
            message: 'login exitoso',
            token
        });
    }
    catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({
            error: error.message 
        });
       
    }
};