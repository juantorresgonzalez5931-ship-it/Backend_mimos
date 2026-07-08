import { obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from "../models/User.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios

export const getUsuarios = async (req,res) => {
try{
    const { data, error } = await obtenerUsuario();
    if(error){
        return res.status(500).json({error: 'Error al obtener los usuarios'});
    }
    return res.status(200).json({
        usuarios: data
    })
}catch (error) {
    console.error('Error al obtener los usuarios: ', error);
    return res.status(500).json({error:'Error al obtener los usuarios'});
};
}

//usuarios por id
export const getUsuariosporId = async (req,res) => {
    try{ 
        const { id } = req.params;
        const { data,error } = await obtenerUsuarioPorId(id);

        if (error || !data) {
        return res.status(404).json({
        error: 'Usuario no encontrado'
    });
}

    return res.status(200).json({
    usuario: data
    });

    }catch (error) {
    console.error('Error al obtener usuario por id: ', error);
    return res.status(500).json({error:'Error al obtener los usuarios por id'});
};
}

//actualizar usuario por id
export const putUsuariosporId = async (req, res) => {
        const { id } = req.params;
        const { nombre, email, contrasena, rol } = req.body;
        
        //Validar datos
        if (!nombre || !email || !contrasena || !rol) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        try{
            const hashedcontrasena = await bcrypt.hash(contrasena, 10);
            const { data, error } = await actualizarUsuario(id, {nombre, email, contrasena: hashedcontrasena, rol});
        

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(200).json({
            usuario: data
        })

    } catch (error) {
        console.error('Error al actualizar:', error);

        return res.status(500).json({
            error: 'Error al actualizar usuario'
        });
    }
}

//eliminar usuario
export const deleteUsuarios = async (req,res)=>{
    const {id} = req.params;
    try {
     const{data,error}=await eliminarUsuario(id);
     if(error){
        return res.status(400).json({message:"Error al eliminar el usuario",error:error.message});
     }

          //si el dato no tiene datos vacios

     if(!data || data.length ===0){
        return res.status(404).json({message:"Usuario no encontrado"});
     }
     return res.status(200).json({
        message:"Usuario eliminado exitosamente",
        usuario:data[0]
    });

    }catch (error) {
    return res.status(500).json({message:"Error del servidor",error:error.message});
    }
};