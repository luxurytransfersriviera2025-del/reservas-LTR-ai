export default {
  async onRequest({ request, env, ctx }) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { userMessage, historial } = await request.json();

      const messages = historial.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      messages.push({
        role: 'user',
        content: userMessage
      });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          system: `Eres un asistente inteligente para reservar traslados a la Riviera Maya. 
Debes ayudar al cliente a:
1. Elegir su destino (Cancún, Tulum, Playa del Carmen, Puerto Morelos, Cozumel)
2. Seleccionar la fecha
3. Indicar la hora
4. Especificar número de pasajeros
5. Proporcionar nombre, teléfono y email para la reserva

Sé amable, profesional y proporciona precios cuando sea necesario.
Precios base por pasajero:
- Cancún: $40
- Tulum: $85
- Playa del Carmen: $65
- Puerto Morelos: $50
- Cozumel: $100

Responde siempre en español de forma concisa.`,
          messages
        })
      });

      if (!response.ok) {
        throw new Error('Claude API error');
      }

      const data = await response.json();
      const botMessage = data.content[0].text;

      return new Response(JSON.stringify({ message: botMessage }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ message: 'Error procesando tu solicitud' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
