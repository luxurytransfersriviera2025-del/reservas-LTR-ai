import chatHandler from '../functions/chat.js';
import reservaHandler from '../functions/reserva.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return chatHandler.onRequest({ request, env, ctx });
    }

    if (url.pathname === '/api/reserva' && request.method === 'POST') {
      return reservaHandler.onRequest({ request, env, ctx });
    }

    // Servir index.html para todo lo demás
    return new Response(await fetch(new URL('/index.html', url.origin)));
  }
};