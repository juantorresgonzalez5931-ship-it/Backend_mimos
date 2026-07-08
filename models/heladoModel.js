import { supabase } from '../config/supabase.js';
export const obtenerTodos = async () => {
  const { data, error } = await supabase.from('helados').select('*');
  return { data, error };
};

export const obtenerPorId = async (id) => {
  const { data, error } = await supabase
    .from('helados').select('*').eq('id', id).single();
  return { data, error };
};

export const obtenerPorCategoria = async (categoria) => {
  const { data, error } = await supabase
    .from('helados').select('*').eq('categoria', categoria);
  return { data, error };
};

export const crearHelado = async (heladoData) => {
  const { data, error } = await supabase
    .from('helados').insert(heladoData).select();
  return { data, error };
};

export const actualizarHelado = async (id, heladoData) => {
  const { data, error } = await supabase
    .from('helados').update(heladoData).eq('id', id).select();
  return { data, error };
};

export const eliminarHelado = async (id) => {
  const { data, error } = await supabase
    .from('helados').delete().eq('id', id);
  return { data, error };
};