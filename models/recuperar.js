import {supabase} from "../config/supabase.js";

//crear codigo de recuperacion
export const crearCodigoRecuperacion = async (usuarioId, codigo) => {
    const expiresAT = new Date(Date.now() + 15 * 60 * 1000) // Expira en 15 minutos

    const {data, error } = await supabase
        .from('recovery_codes')
        .insert({
            usuario_id: usuarioId,
            codigo: codigo,
            expires_at: expiresAT.toISOString()
        })
        .select()

        return { data, error };
}

//obtener codigo no utilizado por usuario
 export const obtenerCodigoValido = async (usuarioId, codigo) => {
    const { data, error } = await supabase
    .from('recovery_codes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('codigo', codigo)
    .eq('usado', false)
    .gt('expiret_at', new Date().toISOString)
    .single();
    return { data, error };
 };

 //marcar como codigo usado

 export const marcarComoUsado = async (codigoId) => {
    const { data, error } = await supabase
        .from('recovery_codes')
        .update({ usado: true })
        .eq('id', codigoId);
    return { data, error };
 }