export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }
    
    if (url.pathname === '/api/reserva' && request.method === 'POST') {
      return handleReserva(request, env);
    }
    
    return new Response('Chatbot activo', { status: 200 });
  }
};

async function handleChat(request, env) {
  const { userMessage, historial } = await request.json();
  const CLAUDE_API_KEY = env.CLAUDE_API_KEY;
  
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
      messages: historial
    })
  });
  
  const data = await response.json();
  return new Response(JSON.stringify({ message: data.content[0].text }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleReserva(request, env) {
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
