import {supabase} from '../config/supabase.js';

//crear el usuario
export const crearUsuario = async (nombre, email, password, rol) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, email, password, rol }])
        .select();
    return { data, error };
}


//obtener todos los usuarios
export const obtenerUsuario = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');
    return { data, error };
};
//obtener un usuario por email para el login
export const obtenerPorEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
        return { data, error };
}

//obtener un usuario id

export const obtenerPorId = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol')
        .eq('id', id)
        .single();
    return { data, error };
};

//actualizar un usuario
export const actualizarUsuario = async (id, campos) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update(campos)
        .eq('id', id)
        .select('id, nombre, email, password, rol')
        .single();
    return { data, error };
};

//eliminar un usuario
export const eliminarUsuario = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .select('id, nombre, email, password, rol')
    return { data, error };
};

   


