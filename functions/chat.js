export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { userMessage, historial } = await context.request.json();

    const CLAUDE_API_KEY = context.env.CLAUDE_API_KEY;
    const sistemaPrompt = `Eres un asistente de atención al cliente de "Reservas Luxury", una empresa de traslados en la Riviera Maya.

Tu objetivo es ayudar a los clientes a reservar traslados de forma conversacional y natural.

DESTINOS DISPONIBLES Y PRECIOS:
- Cancún: $40 USD por pasajero
- Tulum: $85 USD por pasajero
- Playa del Carmen: $65 USD por pasajero
- Puerto Morelos: $50 USD por pasajero
- Cozumel: $100 USD por pasajero

INSTRUCCIONES:
1. Sé amable, profesional y conversacional
2. Ayuda al cliente a elegir destino, fecha, hora y cantidad de pasajeros
3. Responde preguntas sobre traslados, precios, horarios
4. Cuando tengas la información necesaria, presenta el precio con detalles
5. Usa emojis para hacer la conversación amigable
6. Responde completamente en español
7. Si el cliente quiere confirmar, pregunta por nombre, teléfono y email para completar la reserva

Mantén respuestas cortas (máximo 2-3 líneas) y naturales.`;

    const messages = [
      ...historial.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        system: sistemaPrompt,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return new Response(
        JSON.stringify({ error: 'API error', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const botMessage = data.content[0].text;

    return new Response(
      JSON.stringify({ message: botMessage }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}