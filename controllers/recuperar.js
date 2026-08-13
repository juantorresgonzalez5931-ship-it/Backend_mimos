import {crearCodigoRecuperacion, marcarComoUsado, obtenerCodigoValido} from '../models/recuperar.js';
import { obtenerPorEmail, actualizarUsuario } from '../models/User.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// configuramos el transporte nodemailer

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
    }
});

//configurar la logica para enviar el corrreo de recuperacion

export const forgotPassword= async (req, res) => {
    try {
const { email } = req.body;

if (!email) {
    return res.status(400).json({error:'El correo es requerido'});
}

  //verificar si el usuario existe
  const { data:usuario, error:errorUsuario} = await obtenerPorEmail(email);

  if (errorUsuario || !usuario) {
    return res.status(404).json({error:'Usuario no encontrado'});
  }
    
  // generamos los codigos de recuperacion

  const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // codigo de 6 digitoscv

  //guardar el codigo a la base de datos

  const {error:errorCodigo}=await crearCodigoRecuperacion(usuario.id,codigo);

  if (errorCodigo) {
    return res.status(500).json({error:'Error al generar el codigo de recuperacion'});
  }
    //creamos el email del codigo

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject:`Tu codigo de recuperacion es: ${codigo}`,
        html:
        `<h2>Recuperacion de Contraseña</h2>
         <h2>Hola ${usuario.nombre || 'Usuario'},</h2>
         <p> Tu codigo de recuperacion es: ${codigo}</p>
         <h1 style="color: #39a900; font size: 36px;">${codigo}</h1>
         <p> Este codigo es valido por 15 minutos. Si no solicitaste este codigo, por favor ignora este correo.</p>
         <p> Gracias por usar nuestra aplicacion.</p>
         <p> Atentamente, El equipo de Soporte</p>
         <p> No compartas este codigo con nadie, ni siquiera con el equipo de soporte.</p>
        `
    });

    return res.status(200).json({message:'Codigo de recuperacion enviado al correo'});

    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({error:'Error al enviar el codigo de recuperacion'});
    }
}

//cambiar contraseña y verificar el codigo de recuperacion 
export const verifyCode= async (req, res)=>{
    try {
        const {email, codigo, nuevaContrasena}= req.body;

    //verificamos las entradas
    if (!email || !codigo || !nuevaContrasena){
        return res.status (400).json ({error:'todos los campos son requeridos'});
    }

    //verificamos el usuario esta en la base de datos 
    const {data:usuario}=await obtenerPorEmail(email);
    console.log(usuario);

    if (!usuario){
        return res.status (404).json ({error:'usuario no encontrado'});
    }

    //verificamos el codigo de recuperacion 
    const {data:codigoRecuperacion}= await obtenerCodigoValido(usuario.id, codigo);
    if (!codigoRecuperacion){
        return res.status (400).json ({error: 'codigo de recuperacion invalido o expirado'});
    }

    //encriptamos la nueva contraseña
    const hashedPassword= await bcrypt.hash(nuevaContrasena, 10);

    //actualizar la contraseña del usuario en la base de datos 
    const {error: UpdateError}= await actualizarUsuario(
        usuario.id, {password: hashedPassword}
    ) 
    if (UpdateError) throw UpdateError;
    //marcamos el codigo como usado
    await marcarComoUsado (codigoRecuperacion.id);

    //respondemos al cliente que la contraseña se cambio exitosamente 
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Contraseña cambiada exitosamente',
        html:`
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border:1px solid #ddd; paddinG:20px; border-radius: 5px;">
        <h2 style= "color: #333; ">Notificación de cambio de contraseña</h2>
        <p>Hola ${usuario.nombre || 'Usuario'},</p>
        <p>Te informamos que su contrasela ha sido cambiada exitosamente.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #39a900; margin-top: 20px;">
        <p style ="margin: 0; font-size: 14px color: #555;">
        Si no realizaste este cambio, te recomendamos que cambies tu contraseña inmediatamente y contactes con nuestro equipo de soporte.</p>
        </div>
        <p style_color: #555; font.size: 14px; margin-top 30px"
        >Gracias,</p>
        </div>
        `
    });
    return res.status (200).json ({message: 'contraseña cambiada exitosamente'});
    }catch (error) {
    console.log ('Error en verifyCode:', error);
    return res.status (500).json ({error: 'Error al verificar el codigo o cambiar la contraseña'});
    }
};




