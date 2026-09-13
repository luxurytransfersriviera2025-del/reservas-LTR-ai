export default {
  async onRequest({ request, env, ctx }) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const reservaData = await request.json();

      // Guardar en KV si está disponible
      if (env.RESERVAS) {
        const key = `reserva-${Date.now()}`;
        await env.RESERVAS.put(key, JSON.stringify(reservaData), {
          expirationTtl: 7 * 24 * 60 * 60 // 7 días
        });
      }

      // Aquí podrías enviar un email de confirmación
      // Por ahora solo respondemos que se guardó
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Reserva guardada correctamente',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error guardando reserva:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Error guardando la reserva' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
