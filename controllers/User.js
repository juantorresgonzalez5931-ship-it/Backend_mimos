import {obtenerUsuario, obtenerPorId, actualizarUsuario, eliminarUsuario} from '../models/User.js';
import bcrypt from 'bcrypt';

//obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const { data, error } = await obtenerUsuario();
        if(error){
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        return res.status(200).json({
            usuarios: data
        })

} catch(error){
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
}
}


//obtener un usuario por ID
export const getusuariosPorId = async (req, res) => {
    try{
        const { id } = req.params;
        const { data, error } = await obtenerPorId(id);

        if(error||!data){
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.status(200).json({
            usuarios: data
        })
            
    } catch(error){
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

//actualizar un usuario
export const putactualizarUsuario = async (req, res) => {
        const { id } = req.params;
        const { nombre, email, password, rol } = req.body;

        //Validar datos
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

       try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await actualizarUsuario(id, { nombre, email, password: hashedPassword, rol });

        if(error){
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        return res.status(200).json({
            usuarios: data
        })
            
    } catch(error){
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
             error: 'Error al actualizar el usuario' 
        });
    }
}

//eliminar un usuario
export const deleliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try{
        const { data, error } = await eliminarUsuario(id);
        if(error){
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        return res.status(200).json({
            usuarios: data
        })

}   catch(error){
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}