export async function POST({ request }) {
  try {
    console.log('API endpoint llamado');
    
    const formData = await request.formData();
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const empresa = formData.get('empresa');
    const servicio = formData.get('servicio');
    const mensaje = formData.get('mensaje');
    const honeypot = formData.get('website');
    const timestamp = formData.get('timestamp');

    console.log('Datos recibidos:', { nombre, email, empresa, servicio, mensaje: mensaje?.substring(0, 50) + '...' });

    // Anti-spam
    if (honeypot) {
      return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!nombre || !email || !mensaje) {
      return new Response(JSON.stringify({ success: false, message: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar configuración de email
    const emailUser = import.meta.env.EMAIL_USER || 'tu-email@gmail.com';
    const emailPass = import.meta.env.EMAIL_PASS || 'tu-password-app';
    const emailTo = import.meta.env.EMAIL_TO || 'agaetero@gmail.com';

    console.log('Configuración email:', { 
      user: emailUser, 
      pass: emailPass ? '***configurado***' : 'NO CONFIGURADO', 
      to: emailTo 
    });

    // Para pruebas, si no hay configuración de email, simular envío exitoso
    if (emailUser === 'tu-email@gmail.com' || !emailPass || emailPass === 'tu-password-app') {
      console.log('Configuración de email no encontrada, simulando envío exitoso para pruebas');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Mensaje recibido (modo prueba - configura email para envío real)' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Si hay configuración, intentar enviar email real
    console.log('Intentando envío real de email...');
    
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: emailUser,
      to: emailTo,
      subject: `Nuevo mensaje de contacto - ${nombre}`,
      html: `
        <h2>Nuevo mensaje de contacto desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa || 'No especificada'}</p>
        <p><strong>Servicio de interés:</strong> ${servicio || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Enviado desde el formulario de contacto de Salas y Cía. Ltda.</small></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente');

    return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en el endpoint:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 